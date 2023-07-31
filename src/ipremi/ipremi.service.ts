import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../dto/booking-webhook.dto';
import { parseBooking } from '../utils/parse-booking.util';
import { DeskbeeService } from '../deskbee/deskbee.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { processReward } from './ipremi.rules';

@Injectable()
export class IpremiService {
  public logger = new Logger('controlidService');
  constructor(
    private readonly deskbeeService: DeskbeeService,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
  ) {}
  @OnEvent('booking')
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    const bookingParsed = parseBooking(bookingWebhook);
    await this.bookingRepository
      .upsert([bookingParsed.toJson()], ['uuid'])
      .then(() => {
        this.logger.log(
          `${bookingParsed.event} : ${bookingParsed.uuid} Saved!`,
        );
      });
    processReward(bookingParsed);
    console.log(bookingParsed.toJson());
  }
}
