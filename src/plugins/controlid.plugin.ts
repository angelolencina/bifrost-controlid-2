import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { BookingWebhookDto } from '../dtos/booking-webhook.dto';
import IntegrationInterface from '../interfaces/integration.interface';
import { ApiDeskbee } from '../apis/deskbee.api';
import { IsNull, LessThan, Repository } from 'typeorm';
import { parseBooking } from '../utils/parse-booking.util';
import { BookingParsedDto } from '../dtos/booking-parsed.dto';
import { MYSQL_CONTROLID_CONNECTION } from '../database/db.constants';
import { ApiControlid } from '../apis/controlid.api';
import { BookingEntity } from '../entities/booking.entity';
import { AppService } from '../app.service';
import { EntranceDto } from '../dtos/entrance.dto';
import { formatDateToDatabase } from '../utils/format-date.util';
import { setDateToLocal } from '../utils/set-date-to-local.util';
import { isToday } from '../utils/is-today.util';
import { addDaysTodate } from '../utils/add-days-to-date';
import ControlidRepositoryInterface from '../interfaces/controlid-repository.interface';

export class ControlidPlugin implements IntegrationInterface {
  public logger = new Logger('controlidPlugin');
  public jobAccessControl: any;
  public jobAutomatedCheckIn: any;
  public jobGenerateQrCode: any;
  public accessControl: boolean = process.env.ACCESS_CONTROL === 'true';
  public automatedCheckIn: boolean = process.env.AUTOMATED_CHECKIN === 'true';
  public generateUserQrCode: boolean =
    process.env.GENERATE_USER_QRCODE === 'true';
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    private readonly appService: AppService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(MYSQL_CONTROLID_CONNECTION)
    private readonly mysqlConnection: any,
    private readonly controlidRepository: ControlidRepositoryInterface,
    private apiDeskbee: ApiDeskbee,
    private readonly apiControlid: ApiControlid,
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
      const booking = await this.apiDeskbee.getBookingByUuid(
        bookingWebhook.resource.uuid,
      );
      if (booking) {
        this.handleAccessControl(parseBooking(booking, bookingWebhook));
      }
    }
  }

  /*
  idType: Representa se o tag está destinado a uma pessoa ou veículo, caso tenha o valor 1 = pessoa, caso tenha o valor 2 = veículo
  type: Tecnologia do cartão: "0" para ASK/125kHz, "1" para Mifare e "2" para QR-Code.
  */
  async generateQrCode() {
    const users = await this.controlidRepository.getNewRegisteredUsers();
    if (!users || !users.length) {
      this.logger.log(`eventUserQrCode : nenhum usuario`);
      return;
    }

    const payload = <any>[];
    for (const user of users) {
      const code = await this.apiControlid.createUserQrCode(user.id);
      if (!code) {
        this.logger.log(`event: user:${user.id} code not found}`);
        continue;
      }
      await this.controlidRepository.saveUserCard(user.id, code);
      payload.push({
        identifier_type: 'email',
        identifier: user.email,
        code: code,
      });

      this.apiControlid.syncUser(user.id);
    }

    this.apiDeskbee.savePersonalBadge(payload);
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

  automateCheckIn() {
    this.controlidRepository.getUserPassLogs().then((logs: any) => {
      logs = logs.map((log: any) => new EntranceDto(log));
      for (const log of logs) {
        this.appService.saveEntranceLog(log);
      }
      this.apiDeskbee.checkinByUser(logs.map((log: any) => log.toCheckinDto()));
    });
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

  async checkBookingsForToday() {
    const bookings = await this.bookingRepository.find({
      where: {
        sync_date: IsNull(),
        start_date: LessThan(
          formatDateToDatabase(
            setDateToLocal(addDaysTodate(new Date(), 1)),
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
}
