import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { IsNull, LessThan, Repository } from 'typeorm';
import { CronJob } from 'cron';
import { EntranceDto } from '../../dto/entrance.dto';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { BookingParsedDto } from '../../dto/booking-parsed.dto';
import { addDaysToDate } from '../../utils/add-days-to-date';
import { formatDateToDatabase } from '../../utils/format-date.util';
import { isToday } from '../../utils/is-today.util';
import { setDateToLocal } from '../../utils/set-date-to-local.util';
import { DeskbeeService } from '../../deskbee/deskbee.service';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOptions from './interface/controlid-options.interface';
import ControlidRepository from './database/repositories/controlid.repository';
import { ApiControlid } from './api/controlid.api';

export class CronService {
  public logger = new Logger('Controlid-Cron-Service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOptions,
    private readonly deskbeeService: DeskbeeService,
    private readonly apiControlid: ApiControlid,
    private schedulerRegistry: SchedulerRegistry,
    private readonly controlidRepository: ControlidRepository,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(EntranceLogEntity)
    private entranceRepository: Repository<EntranceLogEntity>,
  ) {
    this.init();
  }

  init() {
    if (this.options?.activeAccessControl) {
      this.addCronJob('accessControl', '*/30');
    }
    if (this.options?.automatedCheckin) {
      this.addCronJob('automatedCheckIn', '*/30');
    }
    if (this.options?.genQrCode) {
      this.addCronJob('generateUserQrCode', '*/30');
    }
  }

  addCronJob(name: string, seconds: string) {
    if (name === 'accessControl') {
      const job = new CronJob(`${seconds} * * * * *`, () => {
        this.checkBookingsToAccessControl();
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

  saveEntranceLog(entrance: EntranceDto) {
    this.entranceRepository.save(entrance.toJson()).then(() => {
      this.logger.log(
        `Entrance ${entrance.email} on device ${entrance?.deviceName}  saved`,
      );
    });
  }

  async checkBookingsToAccessControl() {
    const bookings = await this.bookingRepository
      .createQueryBuilder('bookings')
      .where('bookings.sync_date IS NULL ')
      .orWhere('bookings."sync_date" = ""')
      .andWhere('bookings.start_date < :date', {
        date: formatDateToDatabase(
          setDateToLocal(addDaysToDate(new Date(), 1)),
          false,
        ),
      })
      .getMany();
    for (const booking of bookings) {
      try {
        if (isToday(booking.start_date)) {
          this.grantUserAccessToday(
            booking.email,
            booking.start_date,
            booking.end_date,
          );
          booking.sync_date = formatDateToDatabase(new Date());
          this.bookingRepository.save(booking);
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
    this.apiControlid.syncAll();
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
}
