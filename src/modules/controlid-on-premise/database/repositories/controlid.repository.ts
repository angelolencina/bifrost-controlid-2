import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BookingParsedDto } from '../../../../dto/booking-parsed.dto';
import { EntranceLogEntity } from '../../../../entities/entrance-log.entity';
import { formatDateToDatabase } from '../../../../utils/format-date.util';
import { getLastDayString } from '../../../../utils/get-last-day-string.util';
import { setDateToLocal } from '../../../../utils/set-date-to-local.util';
import { Users } from '../../entities/Users.entity';
import { Cards } from '../../entities/Cards.entity';
import { Logs } from '../../entities/Logs.entity';
import { subtractMinutesFromNow } from '../../../../utils/subtract-minutes-from-now.util';

@Injectable()
export default class ControlidRepository {
  private readonly logger = new Logger('ControlidRepository');
  constructor(
    @InjectRepository(EntranceLogEntity)
    private entranceRepository: Repository<EntranceLogEntity>,
    @InjectRepository(Users, 'controlid')
    private userRepository: Repository<Users>,
    @InjectRepository(Cards, 'controlid')
    private cardRepository: Repository<Cards>,
    @InjectRepository(Logs, 'controlid')
    private logsRepository: Repository<Logs>,
  ) {}

  saveUserCard(userId: string, identification: number) {
    const newQr = this.cardRepository.create({
      idUser: userId,
      idType: 1,
      type: 2,
      number: identification.toString(),
      numberStr: `${Math.floor(identification / 65536)},${identification % 65536
        }`,
    });
    return this.cardRepository.save(newQr);
  }
  getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
        deleted: false,
      },
    });
  }

  getGroupIdByName?(name: string): number {
    throw new Error('Method not implemented.');
  }
  blockUserAccessByGroup?(email: string, groupId: number): void {
    throw new Error('Method not implemented.');
  }
  addUserToGroup(userId: number, groupId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeUserFromGroup(userId: number, groupId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getEntranceRecords(): void {
    throw new Error('Method not implemented.');
  }

  getNewRegisteredUsers() {
    return this.userRepository.find({
      where: {
        deleted: false,
        email: Not(IsNull()),
      },
    });
  }

  unblockUserAccessPerLimitDate(booking: BookingParsedDto) {
    const bookingJson: any = booking.toJson();
    const dateStartLimit = booking.tolerance?.checkin_min_time
      ? formatDateToDatabase(setDateToLocal(booking.tolerance.checkin_min_time))
      : bookingJson.start_date;
    const dateLimit = booking?.tolerance?.checkin_max_time
      ? formatDateToDatabase(setDateToLocal(booking.tolerance.checkin_max_time))
      : bookingJson.end_date;
    return this.userRepository.update(
      { email: booking.person.email },
      { dateStartLimit, dateLimit },
    );
  }

  async grantAccessToToday(email: string, start: string, end: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      this.logger.error(`User not found on controlid: ${email}`);
    }
    return this.userRepository.update(
      { email: email },
      { dateStartLimit: start, dateLimit: end },
    );
  }

  async revokeUserAccess(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      this.logger.error(`User not found on controlid: ${email}`);
      return;
    }
    const lastDay = getLastDayString();
    return this.userRepository.update(
      { email },
      { dateStartLimit: lastDay, dateLimit: lastDay },
    );
  }

  async getUserPassLogs() {
    const lastLogDate = await this.getLastDateLog();
    return this.logsRepository.query(
      `SELECT
        u.email,
        l.idDevice,
        l.deviceName,
        l.reader,
        l.idArea,
        l.area,
        l.event,
        l.time as createdAt
      FROM
        logs l
        INNER JOIN users u ON u.id = l.idUser
      WHERE
        l.time > '${lastLogDate}'
        AND u.deleted = 0
        AND l.event = 7 and u.email is not null`,
    );
  }

  getLastDateLog() {
    return this.entranceRepository
      .find({
        order: { created_at: 'DESC' },
        take: 1,
      })
      .then(([res]) => {
        if (!res) {
          return formatDateToDatabase(
            setDateToLocal(subtractMinutesFromNow(10)),
          );
        }
        return formatDateToDatabase(setDateToLocal(new Date(res.created_at)));
      });
  }
}
