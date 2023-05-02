import { BookingParsedDto } from '../dtos/booking-parsed.dto';
import { PassLogsDto } from '../dtos/pass-logs.dto';
import { UserControlidDto } from '../dtos/user-controlid.dto';

export default interface ControlidRepositoryInterface {
  getEntranceRecords?(): void;
  unblockUserAccessPerLimitDate(booking: BookingParsedDto): Promise<any>;
  blockUserAccessPerLimitDateByEmail(email: string): void;

  getNewRegisteredUsers(): Promise<UserControlidDto[]>;
  saveUserCard(userId: number, identification: string): Promise<void>;
  /**
   * Save QRcode custom to user on controlid.
   *
   *
   * @param userId - The id of user of controlid
   * @param identification - identification of user(some information to transform in QRcode)
   * @returns void
   *
   */
  saveUserCard(userId: number, identification: string): Promise<void>;
  getUserByEmail(email: string): Promise<UserControlidDto>;
  getUserPassLogs(): Promise<PassLogsDto[]>;
  getGroupIdByName?(name: string): number;
  blockUserAccessByGroup?(email: string, groupId: number): void;
  addUserToGroup(userId: number, groupId: number): Promise<void>;
  removeUserFromGroup(userId: number, groupId: number): Promise<void>;
}
