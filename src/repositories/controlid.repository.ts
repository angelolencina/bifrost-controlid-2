import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MYSQL_CONTROLID_CONNECTION } from '../database/db.constants';
import { EntranceLogEntity } from '../entities/entrance-log.entity';
import ControlidRepositoryInterface from '../interfaces/controlid-repository.interface';
import { formatDateToDatabase } from '../utils/format-date.util';
import { getLastDayString } from '../utils/get-last-day-string.util';
import { setDateToLocal } from '../utils/set-date-to-local.util';
import { BookingParsedDto } from '../dtos/booking-parsed.dto';

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

  getEntranceRecords(): void {
    throw new Error('Method not implemented.');
  }

  updateUserAccess(booking: BookingParsedDto) {
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
  syncUser(userId: number): Promise<any> {
    throw new Error('Method not implemented.');
  }
  syncAll(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  createUserQrCode(userId: number): Promise<any> {
    throw new Error('Method not implemented.');
  }

  blockUserAccess(email: string) {
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

  async getUserPassLogs() {
    const [lastLog] = await this.getLastDateLog();
    const lastLogDate = lastLog?.created_at
      ? formatDateToDatabase(setDateToLocal(new Date(lastLog.created_at)))
      : getLastDayString();
    return new Promise((resolve, reject) => {
      this.mysqlConnection.query(
        `SELECT u.id, u.email, u.name, l.idDevice, l.deviceName, l.reader, l.idArea, l.area, l.event, l.time as createdAt
          FROM Logs l
          INNER JOIN Users u ON l.idUser = u.id and u.deleted = false
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
