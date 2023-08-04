import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { Repository } from 'typeorm';
import { CronJob } from 'cron';
import { EntranceDto } from '../../dto/entrance.dto';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { addDaysToDate } from '../../utils/add-days-to-date';
import { formatDateToDatabase } from '../../utils/format-date.util';
import { isToday } from '../../utils/is-today.util';
import { setDateToLocal } from '../../utils/set-date-to-local.util';
import { DeskbeeService } from '../../deskbee/deskbee.service';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOptions from './interface/controlid-options.interface';
import ControlidRepository from './database/repositories/controlid.repository';
import { ApiControlid } from './api/controlid.api';
import { CheckInDto } from '../../dto/checkin.dto';

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
      this.addCronJob('getBookingsToCurrentDay', '*/30');
    }
    if (this.options?.automatedCheckIn) {
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

      const job2 = new CronJob(`*/50 * * * * *`, () => {
        this.searchBookingsToCurrentDay();
        this.logger.warn(
          `time each minute for job checkingBookingsToCurrentDay to run!`,
        );
      });
      this.schedulerRegistry.addCronJob('checkingBookingsToCurrentDay', job2);
      job2.start();
      this.logger.warn(
        `job checkingBookingsToCurrentDay added for each minute`,
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

  async automateCheckIn() {
    const passLogs = await this.controlidRepository.getUserPassLogs();
    const logs = passLogs.map((log: any) => new EntranceDto(log));
    for (const log of logs) {
      await this.saveEntranceLog(log);
    }
    const checkIns: CheckInDto[] = logs.map((log: EntranceDto) =>
      log.toCheckInDto(),
    );
    if (checkIns.length > 0) {
      await this.deskbeeService.checkInByUser(checkIns);
    }
  }

  async saveEntranceLog(entrance: EntranceDto) {
    return this.entranceRepository.save(entrance.toJson()).then(() => {
      this.logger.log(
        `Entrance ${entrance.email} on device ${entrance?.deviceName}  saved`,
      );
    });
  }

  async checkBookingsToAccessControl() {
    const nextDay = formatDateToDatabase(
      setDateToLocal(addDaysToDate(new Date(), 1)),
      false,
    );
    const bookings = await this.bookingRepository
      .createQueryBuilder('bookings')
      .where('bookings.sync_date IS NULL ')
      .orWhere('bookings."sync_date" = ""')
      .andWhere('bookings.start_date < :date', {
        date: nextDay,
      })
      .getMany();
    for (const booking of bookings) {
      if (
        this.options.mailsToExcludeFromAccessControl.includes(booking.email)
      ) {
        return;
      }
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

  async searchBookingsToCurrentDay() {
    const bookings = await this.deskbeeService.searchBookings({});
    this.prepareToHandler(bookings);
  }

  public async prepareToHandler(bookings: any[]) {
    for (const booking of bookings) {
      const email = booking.person.email;
      if (
        this.options?.inHomologation &&
        this.options.mailOnHomologation.includes(email)
      ) {
        this.processAccessControl(booking);
        return;
      }
      if (this.options.mailsToExcludeFromAccessControl.includes(email)) {
        return;
      }
      this.processAccessControl(booking);
    }
  }

  async processAccessControl(booking: any) {
    const email = booking.person.email;
    const hasBooking = await this.bookingRepository.findOne({
      where: { uuid: booking.uuid },
    });
    if (!hasBooking?.uuid) {
      const action =
        booking.state == 'fall' || booking.state == 'deleted'
          ? 'deleted'
          : 'created';
      const _booking = {
        uuid: booking.uuid,
        start_date: formatDateToDatabase(
          setDateToLocal(new Date(booking.start_date)),
        ),
        end_date: formatDateToDatabase(
          setDateToLocal(new Date(booking.end_date)),
        ),
        state: booking.state,
        action,
        event: 'booking',
        email: email,
        person: JSON.stringify(booking.person),
        place: JSON.stringify(booking.place),
        min_tolerance: booking?.min_tolerance,
        sync_date: '',
      };
      if (action === 'created') {
        try {
          await this.grantUserAccessToday(
            email,
            _booking.start_date,
            _booking.end_date,
          );
          _booking.sync_date = formatDateToDatabase(new Date());
        } catch (error) {
          this.logger.error(`Error on grant access to ${email} => ${error}`);
        }
      } else {
        try {
          await this.revokeUserAccess(email);
          _booking.sync_date = formatDateToDatabase(new Date());
        } catch (error) {
          this.logger.error(`Error on revoke access to ${email} => ${error}`);
        }
      }
      this.bookingRepository.upsert(_booking, ['uuid', 'event', 'email']);
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

  async revokeUserAccess(email: string) {
    this.logger.log(`Revoke access to last day for ${email}`);
    try {
      await this.controlidRepository.revokeUserAccess(email);
      this.apiControlid.syncAll();
    } catch (error) {
      this.logger.error(`Error on revoke access to ${email} => ${error}`);
    }
  }
}
