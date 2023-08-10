import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BookingParsedDto } from '../../../../dto/booking-parsed.dto';
import { EntranceLogEntity } from '../../../../entities/entrance-log.entity';
import { getLastDayString } from '../../../../utils/get-last-day-string.util';
import { Users } from '../../entities/Users.entity';
import { Cards } from '../../entities/Cards.entity';
import { Logs } from '../../entities/Logs.entity';
import { subtractMinutesFromNow } from '../../../../utils/subtract-minutes-from-now.util';
import { PersonalBadgeEntity } from '../../../../entities/personal-badge.entity';
import { AccountEntity } from '../../../../entities/account.entity';
import { UserDeskbeeDto } from '../../../../dto/user-deskbee.dto.ts';

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
    @InjectRepository(PersonalBadgeEntity)
    private personalBadgeRepository: Repository<PersonalBadgeEntity>,
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
  ) {}

  async saveUserCard(userId: string, qrCodeControlId: number) {
    const [account] = await this.accountRepo.find();
    const integration: any = account?.integration || [];
    const dataIntegration = integration.find(
      (row: any) => row?.name === 'controlid-on-premise',
    );
    if (!!dataIntegration?.mysql) {
      return this.cardRepository.query(
        `INSERT INTO cards (
          idUser, idType, type, number, numberStr
        ) VALUES (
          '${userId}', '1', '2', '${qrCodeControlId}',
          (select CONCAT(CONVERT((${qrCodeControlId} DIV 65536), CHAR), ",", CONVERT((${qrCodeControlId} MOD 65536), CHAR)))
        )`,
      );
    }
    return this.cardRepository.query(
      `INSERT INTO cards (
        idUser, idType, type, number, numberStr
      ) VALUES (
        '${userId}', '1', '2', '${qrCodeControlId}',
        (SELECT CAST(${qrCodeControlId} / 65536 AS TEXT) || ',' || CAST(${qrCodeControlId} % 65536 AS TEXT))
      )`,
    );
  }

  async getLastCreatedUsers() {
    const lastDatePersonalBadge = await this.getLastDatePersonalBadge();
    const timeOfRegistration = lastDatePersonalBadge
      ? `OR timeOfRegistration > '${lastDatePersonalBadge}'`
      : '';
    return this.userRepository.query(`
      SELECT id, email 
      FROM users 
      where deleted = 0 AND email != '' 
      AND (id NOT IN (SELECT idUser FROM cards where idType = 1 AND type = 2) ${timeOfRegistration})
    `);
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
        deleted: false,
      },
    });
  }

  async updateUser(userDeskbee: UserDeskbeeDto) {
    const user = await this.getUserByEmail(userDeskbee.email);
    if (user) {
      this.userRepository.update(
        { email: userDeskbee.email },
        {
          inativo: userDeskbee.status,
          email: userDeskbee.email,
          name: userDeskbee.name_display,
        },
      );
      return;
    }
  }

  async deleteUser(email: string) {
    const user = await this.getUserByEmail(email);
    if (user) {
      this.userRepository.update(
        { email: email },
        {
          deleted: true,
        },
      );
    }
  }

  async createUser(userDeskbee: UserDeskbeeDto) {
    const user = await this.getUserByEmail(userDeskbee.email);
    if (user) {
      return;
    }
    const newUser = this.userRepository.create({
      senha: userDeskbee.uuid,
      pis: '123456',
      name: userDeskbee.name_display,
      email: userDeskbee.email,
      admin: false,
      inativo: false,
      contingency: false,
      deleted: false,
      canUseFacial: true,
      idType: 0,
      expireOnDateLimit: false,
      blackList: false,
      idArea: '1',
    });
    return this.userRepository.save(newUser);
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
      ? new Date(booking.tolerance.checkin_min_time)
      : bookingJson.start_date;
    const dateLimit = booking?.tolerance?.checkin_max_time
      ? new Date(booking.tolerance.checkin_max_time)
      : bookingJson.end_date;
    return this.userRepository.update(
      { email: booking.person.email },
      { dateStartLimit, dateLimit },
    );
  }

  async grantAccessToToday(email: string, start: Date, end: Date) {
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
          return subtractMinutesFromNow(10);
        }
        return new Date(res.created_at);
      });
  }

  getLastDatePersonalBadge() {
    return this.personalBadgeRepository.find().then(([res]) => {
      if (!res) {
        return null;
      }
      return new Date(res.created_at);
    });
  }
}
