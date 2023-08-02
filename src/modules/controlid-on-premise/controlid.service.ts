import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../../dto/booking-webhook.dto';
import { parseBooking } from '../../utils/parse-booking.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingParsedDto } from '../../dto/booking-parsed.dto';
import { BookingEntity } from '../../entities/booking.entity';
import { isToday } from '../../utils/is-today.util';
import { ApiControlid } from './api/controlid.api';
import { config } from 'dotenv';
import { CronService } from './cron.service';
import { formatDateToDatabase } from '../../utils/format-date.util';
import ControlidRepository from './database/repositories/controlid.repository';

config();

const { ACCESS_CONTROL } = process.env;

@Injectable()
export class ControlidService {
  public logger = new Logger('Controlid-On-Premise-Service');
  public accessControl: boolean = ACCESS_CONTROL === 'true';
  constructor(
    private readonly apiControlid: ApiControlid,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    //private controlidRepository: ControlidRepository,
    private cronService: CronService,
  ) {}

  @OnEvent('booking')
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    if (this.accessControl) {
      this.logger.log(
        `Booking : ${bookingWebhook.resource.uuid} - ${bookingWebhook.included.status.name} - ${bookingWebhook.included.person.email}`,
      );
      this.handleAccessControl(parseBooking(bookingWebhook));
    }
  }

  async handleAccessControl(booking: BookingParsedDto) {
    if (booking.state === 'deleted' || booking.state === 'fall') {
      //await this.blockUserAccess(booking.person.email);
      this.bookingRepository
        .update(
          { uuid: booking.uuid },
          { sync_date: formatDateToDatabase(new Date()) },
        )
        .then(() => {
          this.logger.log(`Booking : ${booking.uuid} Saved!`);
        });
    } else if (isToday(new Date(booking.start_date))) {
      //await this.controlidRepository.unblockUserAccessPerLimitDate(booking);
      this.bookingRepository
        .update(
          { uuid: booking.uuid },
          { sync_date: formatDateToDatabase(new Date()) },
        )
        .then(() => {
          this.logger.log(`Booking : ${booking.uuid} Saved!`);
        });
    }

    this.apiControlid.syncAll();
  }

  async blockUserAccess(email: string) {
    //await this.controlidRepository.blockUserAccessPerLimitDateByEmail(email);
    this.apiControlid.syncAll();
  }
}
