import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { BookingEntity } from '../../entities/booking.entity';
import { IsNull, LessThan, Repository } from 'typeorm';
import { CronJob } from 'cron';
import ControlidRepository from '../../repositories/controlid.repository';
import { EntranceDto } from '../../dto/entrance.dto';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { BookingParsedDto } from '../../dto/booking-parsed.dto';
import { addDaysToDate } from '../../utils/add-days-to-date';
import { formatDateToDatabase } from '../../utils/format-date.util';
import { isToday } from '../../utils/is-today.util';
import { setDateToLocal } from '../../utils/set-date-to-local.util';
import { DeskbeeService } from '../../deskbee/deskbee.service';
import { AccountEntity } from '../../entities/account.entity';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOptions from './interface/controlid-options.interface';

export class CronService {
  public logger = new Logger('Controlid-Cron-Service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOptions,
    private readonly deskbeeService: DeskbeeService,
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
      this.addCronJob('accessControl', '0');
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
}
