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
import { ControlidOnPremiseDto } from '../../dto/controlid-on-premise-request.dto';
import { UserWebhookDto } from '../../dto/user-webhook.dto';

config();

@Injectable()
export class ControlidService {
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
    if (this?.options?.accessControlByLimit) {
      const userGroups = await this.getUserGroups(
        bookingWebhook.included.person.email,
      );
      bookingWebhook.included.person.groups = userGroups;
      let accessControlOff = false;

      const mailInHomologation =
        this.options?.inHomologation &&
        this.options.mailsInHomologation.includes(
          bookingWebhook.included.person.email,
        );
      const excludedEmail = this.options?.mailsExcluded.includes(
        bookingWebhook.included.person.email,
      );
      const excludedGroup = this.options.deskbeeExcludedGroups.some((value) =>
        userGroups.includes(value),
      );
      accessControlOff = excludedEmail || excludedGroup;
      if (this.options?.inHomologation) {
        if (mailInHomologation) {
          this.processAccessControl(bookingWebhook);
        }
        return;
      }
      if (accessControlOff) {
        return;
      }
      this.processAccessControl(bookingWebhook);
    }
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
    // this.logger.log(
    //   `Processing AccessControl : ${bookingWebhook.resource.uuid} - ${bookingWebhook.included.status.name} - ${bookingWebhook.included.person.email}`,
    // );
    // const newBooking = parseBooking(bookingWebhook).toSaveObject();
    // if (isToday(newBooking.start_date) && newBooking.action === 'created') {
    //   const email = bookingWebhook.included.person.email;
    //   try {
    //     await this.grantUserAccessToday(
    //       email,
    //       newBooking.start_date,
    //       newBooking.end_date,
    //     );
    //     newBooking.sync_date = formatDateToDatabase(new Date());
    //   } catch (error) {
    //     this.logger.error(`Error on grant access to ${email} => ${error}`);
    //   }
    // }
    // newBooking.sync_date = '';
    // this.bookingRepository.upsert(newBooking, ['uuid', 'event', 'email']);
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
