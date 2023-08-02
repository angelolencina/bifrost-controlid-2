import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MYSQL_CONTROLID_CONNECTION } from '../modules/controlid-on-premise/database/db.constants';
import { EntranceLogEntity } from '../entities/entrance-log.entity';
import ControlidRepositoryInterface from '../interfaces/controlid-repository.interface';
import { formatDateToDatabase } from '../utils/format-date.util';
import { getLastDayString } from '../utils/get-last-day-string.util';
import { setDateToLocal } from '../utils/set-date-to-local.util';
import { BookingParsedDto } from '../dto/booking-parsed.dto';
import { PassLogsDto } from '../dto/pass-logs.dto';
import { UserControlidDto } from '../dto/user-controlid.dto';

@Injectable()
export default class ControlidRepository
  implements ControlidRepositoryInterface
{
  private readonly logger = new Logger('ControlidRepository');
  constructor(
    @Inject(MYSQL_CONTROLID_CONNECTION)
    private readonly mysqlConnection: any,
    @InjectRepository(EntranceLogEntity)
    private entranceRepository: Repository<EntranceLogEntity>,
  ) {}

  saveUserCard(userId: number, identification: string): Promise<void> {
    const query = `
    INSERT INTO cards (
      idUser, idType, type, number, numberStr
    ) VALUES (
      '${userId}', '1', '2', '${identification}',
      (select CONCAT(CONVERT((${identification} DIV 65536), CHAR), ",", CONVERT((${identification} MOD 65536), CHAR)))
    )
  `;
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        query,
        (err: any, results: any, fields: any) => {
          if (err) {
            this.logger.error(`Error saving card users: ${err.message}`);
            reject(err);
          }
          resolve(results);
        },
      );
    });
  }
  getUserByEmail(email: string): Promise<UserControlidDto> {
    const query = `
    SELECT id, email, name, dateLimit, dateStartLimit FROM users where deleted = 0 AND email != '' AND email = '${email}'
  `;
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        query,
        (err: any, results: any, fields: any) => {
          if (err) {
            this.logger.error(`Error saving card users: ${err.message}`);
            reject(err);
          }
          resolve(results);
        },
      );
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

  getNewRegisteredUsers(): Promise<UserControlidDto[]> {
    const now = new Date();
    const lastSixMinutes = new Date(now.getTime() - 6 * 60000);
    const query = `SELECT id, email, name, dateLimit, dateStartLimit FROM users where deleted = 0 AND email != '' AND id NOT IN (SELECT idUser FROM cards where idType = 1 AND type = 2) OR timeOfRegistration > '${lastSixMinutes}'`;
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        query,
        (err: any, results: any, fields: any) => {
          if (err) {
            this.logger.error(
              `Error when getting new registered users: ${err.message}`,
            );
            reject(err);
          }
          resolve(results);
        },
      );
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
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        `UPDATE users 
                SET dateStartLimit = '${dateStartLimit}', dateLimit = '${dateLimit}' 
                WHERE email = '${booking.person.email}'`,
        (err: any, results: any, fields: any) => {
          if (err) {
            this.logger.error(
              `Error when updating user access email: ${booking.person.email}  on controlId`,
            );
            reject(err);
          }
          this.logger.log(
            `User ${booking.person.email} access Updated on controlId to DateStartLimit: ${dateStartLimit} and DateLimit: ${dateLimit}`,
          );
          resolve(true);
        },
      );
    });
  }

  blockUserAccessPerLimitDateByEmail(email: string) {
    const lastDay = getLastDayString();
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        `UPDATE users 
                    SET dateStartLimit = '${lastDay}', dateLimit = '${lastDay}' 
                    WHERE email = '${email}'`,
        (err: any, results: any, fields: any) => {
          if (err) {
            this.logger.error(
              `Error when blocking user ${email} access on controlId`,
            );
            reject(err);
          }
          this.logger.log(`User ${email} access blocked on controlId`);
          resolve(true);
        },
      );
    });
  }

  async getUserPassLogs(): Promise<PassLogsDto[]> {
    const [lastLog] = await this.getLastDateLog();
    const lastLogDate = lastLog?.created_at
      ? formatDateToDatabase(setDateToLocal(new Date(lastLog.created_at)))
      : getLastDayString();
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        `SELECT u.id, u.email, u.name, l.idDevice, l.deviceName, l.reader, l.idArea, l.area, l.event, l.time as createdAt
          FROM logs l
          INNER JOIN users u ON l.idUser = u.id and u.deleted = false
          WHERE l.event = 7 and email is not null and l.time > '${lastLogDate}' order by l.time asc`,
        (err: any, results: any, fields: any) => {
          if (err) {
            reject(err);
          }
          resolve(results);
        },
      );
    });
  }
  getLastDateLog() {
    return this.entranceRepository.find({
      order: { created_at: 'DESC' },
      take: 1,
    });
  }
}
