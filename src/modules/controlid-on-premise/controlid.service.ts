import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../../dto/booking-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { ApiControlid } from './api/controlid.api';
import { config } from 'dotenv';
import { CronService } from './cron.service';
import ControlidRepository from './database/repositories/controlid.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';

import { DeskbeeService } from '../../deskbee/deskbee.service';
import { UserWebhookDto } from '../../dto/user-webhook.dto';
import { parseBooking } from '../../utils/parse-booking.util';
import { isToday } from '../../utils/is-today.util';
import { ControlidOnPremiseDto } from './dto/controlid-on-premise-request.dto';

config();

const BOOKING_EVENT = 'booking';
const USER_EVENT = 'user';

@Injectable()
export class ControlidOnPremiseService {
  public logger = new Logger('controlid-on-premise-service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOnPremiseDto,
    private readonly apiControlid: ApiControlid,
    @InjectRepository(BookingEntity)
    private bookingRepository: BookingRepository,
    private readonly deskbeeService: DeskbeeService,
    private controlidRepository: ControlidRepository,
    private cronService: CronService,
  ) {}

  @OnEvent(BOOKING_EVENT)
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    if (!this.options.isActive) return;

    const { email } = bookingWebhook.included.person;
    const userGroups = await this.getUserGroups(email);
    bookingWebhook.included.person.groups = userGroups;

    if (this.shouldProcessAccessControl(email, userGroups)) {
      this.processAccessControl(bookingWebhook);
    }
  }

  @OnEvent(USER_EVENT)
  async handleUser(userWebhook: UserWebhookDto) {
    if (userWebhook.resource.action === 'created') {
      const user = await this.deskbeeService.getUser(userWebhook.resource.uuid);
      if (!user) {
        return;
      }
      this.controlidRepository.createUser(user);
    }
    if (userWebhook.resource.action === 'updated') {
      const user = await this.deskbeeService.getUser(userWebhook.resource.uuid);
      if (!user) {
        return;
      }
      this.controlidRepository.updateUser(user);
    }

    if (userWebhook.resource.action === 'deleted') {
      this.controlidRepository.deleteUser(userWebhook.included.email);
    }
  }

  private shouldProcessAccessControl(
    email: string,
    userGroups: string[],
  ): boolean {
    if (!this.options.accessControlByLimit) return false;

    if (this.isExcludedEmail(email) || this.isExcludedGroup(userGroups))
      return false;

    if (
      this.isInHomologationEmail(email) ||
      this.isAccessControlLimitedToGroup(userGroups)
    )
      return true;

    return true;
  }

  private isExcludedEmail(email: string): boolean {
    return this.options.mailsExcluded?.includes(email) ?? false;
  }

  private isInHomologationEmail(email: string): boolean {
    return (
      (this.options.inHomologation &&
        this.options.mailsInHomologation?.includes(email)) ??
      false
    );
  }

  private isExcludedGroup(userGroups: string[]): boolean {
    return (
      this.options.deskbeeExcludedGroups?.some((group) =>
        userGroups?.includes(group),
      ) ?? false
    );
  }

  private isAccessControlLimitedToGroup(userGroups: string[]): boolean {
    return (
      (this.options.limitAccessControlToGroupsDeskbee &&
        userGroups?.some((uuid) =>
          this.options.deskbeeGroupUuids?.includes(uuid),
        )) ??
      false
    );
  }

  async processAccessControl(bookingWebhook: BookingWebhookDto) {
    this.logger.log(
      `Processing AccessControl : ${bookingWebhook.resource.uuid} - ${bookingWebhook.included.status.name} - ${bookingWebhook.included.person.email}`,
    );
    const newBooking = parseBooking(bookingWebhook).toJson();
    if (isToday(newBooking.start_date) && newBooking.action === 'created') {
      const email = bookingWebhook.included.person.email;
      try {
        await this.grantUserAccessToday(
          email,
          newBooking.start_date,
          newBooking.end_date,
        );
        newBooking.sync_date = new Date();
      } catch (error) {
        this.logger.error(`Error on grant access to ${email} => ${error}`);
      }
    }
    newBooking.sync_date = undefined;
    this.bookingRepository.upsert(newBooking, ['uuid', 'event', 'email']);
  }

  async revokeUserAccess(email: string) {
    this.logger.log(`Revoking access to last day for ${email}`);
    try {
      await this.controlidRepository.revokeUserAccess(email);
      this.apiControlid.syncAll();
    } catch (error) {
      this.logger.error(`Error on revoke access to ${email} => ${error}`);
    }
  }

  async grantUserAccessToday(email: string, start: Date, end: Date) {
    this.logger.log(`Granting access today for ${email}`);
    try {
      await this.controlidRepository.grantAccessToToday(email, start, end);
      this.apiControlid.syncAll();
    } catch (error) {
      this.logger.error(`Error on grant access to ${email} => ${error}`);
    }
  }

  getUserGroups(email: string) {
    return this.deskbeeService.getUserGroups(email);
  }
}
