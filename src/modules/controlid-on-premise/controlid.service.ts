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

@Injectable()
export class ControlidOnPremiseService {
  public logger = new Logger('Controlid-On-Premise-Service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOnPremiseDto,
    private readonly apiControlid: ApiControlid,
    @InjectRepository(BookingEntity)
    private bookingRepository: BookingRepository,
    private readonly deskbeeService: DeskbeeService,
    private controlidRepository: ControlidRepository,
    private cronService: CronService,
  ) {}

  @OnEvent('booking')
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    const { email } = bookingWebhook.included.person;
    const userGroups = await this.getUserGroups(email);
    bookingWebhook.included.person.groups = userGroups;

    const {
      isActive,
      mailsExcluded,
      deskbeeExcludedGroups,
      inHomologation,
      mailsInHomologation,
      accessControlByLimit,
      limitAccessControlToGroupsDeskbee,
      deskbeeGroupUuids,
    } = this.options;

    if (!isActive) return;

    const isExcludedEmail = mailsExcluded?.includes(email);
    const isInHomologationEmail =
      inHomologation && mailsInHomologation?.includes(email);
    const isExcludedGroup = deskbeeExcludedGroups?.some((group) =>
      userGroups?.includes(group),
    );
    const isAccessControlLimitedToGroup =
      limitAccessControlToGroupsDeskbee &&
      userGroups?.some((uuid: string) => deskbeeGroupUuids?.includes(uuid));

    if (
      accessControlByLimit &&
      this.shouldProcessAccessControl(
        isInHomologationEmail,
        isExcludedEmail,
        isExcludedGroup,
      )
    ) {
      this.processAccessControl(bookingWebhook);
    } else if (isAccessControlLimitedToGroup) {
      this.processAccessControl(bookingWebhook);
    }
  }

  shouldProcessAccessControl(
    isInHomologationEmail: boolean,
    isExcludedEmail: boolean,
    isExcludedGroup: boolean,
  ) {
    return isInHomologationEmail || (!isExcludedEmail && !isExcludedGroup);
  }

  @OnEvent('user')
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
