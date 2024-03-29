import { BookingParsedDto } from '../dto/booking-parsed.dto';
import { PassLogsDto } from '../dto/pass-logs.dto';
import { UserControlidDto } from '../dto/user-controlid.dto';

export default interface ControlidRepositoryInterface {
  getEntranceRecords?(): void;
  unblockUserAccessPerLimitDate(booking: BookingParsedDto): Promise<any>;
  blockUserAccessPerLimitDateByEmail(email: string): void;

  getNewRegisteredUsers(): Promise<UserControlidDto[]>;
  saveUserCard(userId: string, identification: number): Promise<any>;
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
