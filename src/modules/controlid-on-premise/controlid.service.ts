import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../../dto/booking-webhook.dto';
import { parseBooking } from '../../utils/parse-booking.util';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { isToday } from '../../utils/is-today.util';
import { ApiControlid } from './api/controlid.api';
import { config } from 'dotenv';
import { CronService } from './cron.service';
import { formatDateToDatabase } from '../../utils/format-date.util';
import ControlidRepository from './database/repositories/controlid.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOptions from './interface/controlid-options.interface';
import { DeskbeeService } from '../../deskbee/deskbee.service';

config();

@Injectable()
export class ControlidService {
  public logger = new Logger('Controlid-On-Premise-Service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOptions,
    private readonly apiControlid: ApiControlid,
    @InjectRepository(BookingEntity)
    private bookingRepository: BookingRepository,
    private readonly deskbeeService: DeskbeeService,
    private controlidRepository: ControlidRepository,
    private cronService: CronService,
  ) {}

  @OnEvent('booking')
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    if (this?.options?.activeAccessControl) {
      const userGroups = await this.getUserGroups(
        bookingWebhook.included.person.email,
      );
      bookingWebhook.included.person.groups = userGroups;
      let accessControlOff = false;

      const mailInHomologation =
        this.options?.inHomologation &&
        this.options.mailOnHomologation.includes(
          bookingWebhook.included.person.email,
        );
      const excludedEmail =
        this.options?.mailsToExcludeFromAccessControl.includes(
          bookingWebhook.included.person.email,
        );
      const excludedGroup =
        this.options.groupsUuidToExcludeFromAccessControl.some((value) =>
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

  async processAccessControl(bookingWebhook: BookingWebhookDto) {
    this.logger.log(
      `Booking : ${bookingWebhook.resource.uuid} - ${bookingWebhook.included.status.name} - ${bookingWebhook.included.person.email}`,
    );
    const newBooking = parseBooking(bookingWebhook).toSaveObject();
    if (isToday(newBooking.start_date) && newBooking.action === 'created') {
      const email = bookingWebhook.included.person.email;
      try {
        await this.grantUserAccessToday(
          email,
          newBooking.start_date,
          newBooking.end_date,
        );
        newBooking.sync_date = formatDateToDatabase(new Date());
      } catch (error) {
        this.logger.error(`Error on grant access to ${email} => ${error}`);
      }
    }
    newBooking.sync_date = '';
    this.bookingRepository.upsert(newBooking, ['uuid', 'event', 'email']);
  }

  async revokeUserAccess(email: string) {
    this.logger.log(`Revoke access to last day for ${email}`);
    try {
      await this.controlidRepository.revokeUserAccess(email);
      this.apiControlid.syncAll();
    } catch (error) {
      this.logger.error(`Error on revoke access to ${email} => ${error}`);
    }
  }

  async grantUserAccessToday(email: string, start: string, end: string) {
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
