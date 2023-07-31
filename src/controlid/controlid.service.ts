import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../dto/booking-webhook.dto';
import { parseBooking } from '../utils/parse-booking.util';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { BookingParsedDto } from '../dto/booking-parsed.dto';
import { BookingEntity } from '../entities/booking.entity';
import { isToday } from '../utils/is-today.util';
import { MYSQL_CONTROLID_CONNECTION } from '../database/db.constants';
import { ApiControlid } from '../apis/controlid.api';
import { EntranceLogEntity } from '../entities/entrance-log.entity';
import { EntranceDto } from '../dto/entrance.dto';
import ControlidRepository from '../repositories/controlid.repository';
import { addDaysToDate } from '../utils/add-days-to-date';
import { formatDateToDatabase } from '../utils/format-date.util';
import { setDateToLocal } from '../utils/set-date-to-local.util';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as dotenv from 'dotenv';
import { DeskbeeService } from '../deskbee/deskbee.service';
dotenv.config();
const { ACCESS_CONTROL, AUTOMATED_CHECK_IN, GENERATE_USER_QR_CODE } =
  process.env;

@Injectable()
export class ControlidService {
  public logger = new Logger('controlidService');
  public accessControl: boolean = ACCESS_CONTROL === 'true';
  public automatedCheckIn: boolean = AUTOMATED_CHECK_IN === 'true';
  public generateUserQrCode: boolean = GENERATE_USER_QR_CODE === 'true';
  constructor(
    private readonly controlidRepository: ControlidRepository,
    private readonly deskbeeService: DeskbeeService,
    private readonly apiControlid: ApiControlid,
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @Inject(MYSQL_CONTROLID_CONNECTION)
    private readonly mysqlConnection: any,
    @InjectRepository(EntranceLogEntity)
    private entranceRepository: Repository<EntranceLogEntity>,
  ) {
    if (this.accessControl) {
      this.addCronJob('accessControl', '0');
    }
    if (this.automatedCheckIn) {
      this.addCronJob('automatedCheckIn', '*/30');
    }
    if (this.generateUserQrCode) {
      this.addCronJob('generateUserQrCode', '*/30');
    }
  }

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
      await this.blockUserAccess(booking.person.email);
      booking.setSync(new Date());
    } else if (isToday(new Date(booking.start_date))) {
      await this.controlidRepository.unblockUserAccessPerLimitDate(booking);
      booking.setSync(new Date());
    }
    this.bookingRepository.upsert([booking.toJson()], ['uuid']).then(() => {
      this.logger.log(`Booking : ${booking.uuid} Saved!`);
    });
    this.apiControlid.syncAll();
  }

  async blockUserAccess(email: string) {
    await this.controlidRepository.blockUserAccessPerLimitDateByEmail(email);
    this.apiControlid.syncAll();
  }

  saveEntranceLog(entrance: EntranceDto) {
    this.entranceRepository.save(entrance.toJson()).then(() => {
      this.logger.log(
        `Entrance ${entrance.email} on device ${entrance?.deviceName}  saved`,
      );
    });
  }

  automateCheckIn() {
    this.controlidRepository.getUserPassLogs().then((logs: any) => {
      logs = logs.map((log: any) => new EntranceDto(log));
      for (const log of logs) {
        this.saveEntranceLog(log);
      }
      const checkIns = logs.map((log: any) => log.toCheckInDto());
      if (checkIns.length > 0) {
        this.deskbeeService.checkInByUser(checkIns);
      }
    });
  }

  async checkBookingsForToday() {
    const bookings = await this.bookingRepository.find({
      where: {
        sync_date: IsNull(),
        start_date: LessThan(
          formatDateToDatabase(
            setDateToLocal(addDaysToDate(new Date(), 1)),
            false,
          ),
        ),
      },
    });
    for (const booking of bookings) {
      if (isToday(new Date(booking.start_date))) {
        const bookingParsed = BookingParsedDto.buildFromJson(booking);
        await this.controlidRepository.unblockUserAccessPerLimitDate(
          bookingParsed,
        );
        bookingParsed.setSync(new Date());
        this.bookingRepository.save(bookingParsed.toJson()).then(() => {
          this.logger.log(`Booking : ${booking.uuid} Saved!`);
        });
      }
    }
    if (bookings?.length) {
      this.logger.log(`Control access: ${bookings?.length} bookings to sync!`);
    } else {
      this.logger.log(`Control access: No bookings to sync!`);
    }
  }

  addCronJob(name: string, seconds: string) {
    if (name === 'accessControl') {
      const job = new CronJob(`${seconds} * * * * *`, () => {
        this.checkBookingsForToday();
        this.logger.warn(`time (${seconds}) for job ${name} to run!`);
      });
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      this.logger.warn(
        `job ${name} added for each minute at ${seconds} seconds!`,
      );
    }

    if (name === 'automatedCheckIn') {
      const job = new CronJob(`${seconds} * * * * *`, () => {
        this.automateCheckIn();
        this.logger.warn(`time (${seconds}) for job ${name} to run!`);
      });
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      this.logger.warn(
        `job ${name} added for each minute at ${seconds} seconds!`,
      );
    }

    if (name === 'generateUserQrCode') {
      const job = new CronJob(`${seconds} * * * * *`, () => {
        this.logger.warn(`time (${seconds}) for job ${name} to run!`);
      });
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      this.logger.warn(
        `job ${name} added for each minute at ${seconds} seconds!`,
      );
    }
  }
}
