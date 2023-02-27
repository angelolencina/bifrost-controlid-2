import { BookingParsedDto } from '../dtos/booking-parsed.dto';

export default interface ControlidRepositoryInterface {
  getEntranceRecords?(): void;
  updateUserAccess?(booking: BookingParsedDto): void;
  blockUserAccess?(email: string): void;
  syncUser(userId: number): Promise<any>;
  syncAll(): Promise<any>;
  createUserQrCode(userId: number): Promise<any>;
}
