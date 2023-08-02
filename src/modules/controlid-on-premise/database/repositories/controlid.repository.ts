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
  ) {}

  saveUserCard(userId: string, identification: number) {
    const newQr = this.cardRepository.create({
      idUser: userId,
      idType: 1,
      type: 2,
      number: identification.toString(),
      numberStr: `${Math.floor(identification / 65536)},${
        identification % 65536
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

  blockUserAccessPerLimitDateByEmail(email: string) {
    const lastDay = getLastDayString();
    return this.userRepository.update(
      { email },
      { dateStartLimit: lastDay, dateLimit: lastDay },
    );
  }

  async getUserPassLogs() {
    const [lastLog] = await this.getLastDateLog();
    const lastLogDate = lastLog?.created_at
      ? formatDateToDatabase(setDateToLocal(new Date(lastLog.created_at)))
      : getLastDayString();
    return this.userRepository
      .createQueryBuilder('logs')
      .innerJoin('users', 'u', 'u.id = logs.idUser')
      .where(
        'u.deleted = false and email is not null and logs.event = 7 and logs.time > :lastLogDate',
        { lastLogDate },
      )
      .getMany();
  }
  getLastDateLog() {
    return this.entranceRepository.find({
      order: { created_at: 'DESC' },
      take: 1,
    });
  }
}
