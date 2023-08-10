import { Inject, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { IsNull, Repository } from 'typeorm';
import { CronJob } from 'cron';
import { EntranceDto } from '../../dto/entrance.dto';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { addDaysToDate } from '../../utils/add-days-to-date';
import { DeskbeeService } from '../../deskbee/deskbee.service';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidRepository from './database/repositories/controlid.repository';
import { ApiControlid } from './api/controlid.api';
import { CheckInDto } from '../../dto/checkin.dto';
import { PersonalBadgeEntity } from '../../entities/personal-badge.entity';
import { ControlidOnPremiseDto } from '../../dto/controlid-on-premise-request.dto';
import { setDateToLocal } from '../../utils/set-date-to-local.util';
import { subtractMinutesFromDate } from '../../utils/subtract-minutes-from-date';
import { addMinutesFromDate } from '../../utils/add-minutes-from-date';

export class CronService {
  public logger = new Logger('Controlid-Cron-Service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOnPremiseDto,
    private readonly deskbeeService: DeskbeeService,
    private readonly apiControlid: ApiControlid,
    private schedulerRegistry: SchedulerRegistry,
    private readonly controlidRepository: ControlidRepository,
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
    @InjectRepository(EntranceLogEntity)
    private entranceRepository: Repository<EntranceLogEntity>,
    @InjectRepository(PersonalBadgeEntity)
    private personalBadgeRepository: Repository<PersonalBadgeEntity>,
  ) {
    this.init();
  }

  init() {
    if (this.options?.accessControlByLimit) {
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
        this.createUserQrCode();
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
    this.logger.log(`Automated check in for ${logs.length} users`);
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
    const nextDay = addDaysToDate(new Date(), 1);

    const bookings = await this.bookingRepository
      .createQueryBuilder('bookings')
      .where('bookings.sync_date IS NULL ')
      .orWhere('bookings."sync_date" = ""')
      .andWhere('bookings.start_date < :date', {
        date: nextDay,
      })
      .getMany();
    for (const booking of bookings) {
      if (this.options.mailsExcluded.includes(booking.email)) {
        return;
      }
      try {
        // if (isToday(booking.start_date)) {
        //   this.grantUserAccessToday(
        //     booking.email,
        //     booking.start_date,
        //     booking.end_date,
        //   );
        //   booking.sync_date = formatDateToDatabase(new Date());
        //   this.bookingRepository.save(booking);
        // }
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
        this.options.mailsInHomologation.includes(email)
      ) {
        this.processAccessControl(booking);
        return;
      }
      if (this.options.mailsExcluded.includes(email)) {
        return;
      }
      this.processAccessControl(booking);
    }
  }

  async createUserQrCode() {
    const users = await this.controlidRepository.getLastCreatedUsers();
    this.logger.log(`Creating ${users.length} qr codes`);
    for (const user of users) {
      const code = await this.apiControlid.createUserQrCode(user.id);
      await this.controlidRepository.saveUserCard(user.id, code);
      this.logger.log(`Qr code created for user ${user.email} code: ${code}`);
      const newBadge = this.personalBadgeRepository.create({
        code,
        email: user.email,
      });
      this.personalBadgeRepository.save(newBadge);
    }
    this.sendPersonalBadge();
  }

  async sendPersonalBadge() {
    const badges = await this.personalBadgeRepository.find({
      where: { sync_date: IsNull() },
    });
    const badgesToSend = badges.map((badge) => {
      return {
        identifier_type: 'email',
        identifier: badge.email,
        code: badge.code,
      };
    });
    this.logger.log(`Sending ${badgesToSend.length} Personalbadges to deskbee`);
    await this.deskbeeService.sendPersonalBadge(badgesToSend);
    for (const badge of badges) {
      badge.sync_date = new Date();
      await this.personalBadgeRepository.save(badge);
    }
  }

  async processAccessControl({
    person,
    place,
    uuid,
    state,
    start_date,
    end_date,
    min_tolerance,
  }: any) {
    const email = person.email;
    const hasBooking = await this.bookingRepository.findOne({
      where: { uuid },
    });

    if (!hasBooking?.uuid) {
      const action =
        state == 'fall' || state == 'deleted' ? 'deleted' : 'created';
      const booking: any = {
        uuid: uuid,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        state: state,
        action,
        event: 'booking',
        email: email,
        person: person,
        place: place,
        tolerance: {
          minutes: min_tolerance,
          checkin_max_time: addMinutesFromDate(
            new Date(start_date),
            min_tolerance,
          ),
          checkin_min_time: subtractMinutesFromDate(
            new Date(start_date),
            min_tolerance,
          ),
        },
      };
      if (action === 'created') {
        try {
          await this.grantUserAccessToday(
            email,
            setDateToLocal(booking.start_date),
            setDateToLocal(booking.end_date),
          );
          booking['sync_date'] = new Date();
        } catch (error) {
          this.logger.error(`Error on grant access to ${email} => ${error}`);
        }
      } else {
        try {
          await this.revokeUserAccess(email);
          booking.sync_date = new Date();
        } catch (error) {
          this.logger.error(`Error on revoke access to ${email} => ${error}`);
        }
      }
      this.bookingRepository.upsert(booking, ['uuid', 'event', 'email']);
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
