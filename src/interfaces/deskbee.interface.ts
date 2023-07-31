import { BookingDto } from '../dtos/booking.dto';
import { CheckInDto } from '../dtos/checkin.dto';
import { PersonalBadgeDto } from '../dtos/personal-badge.dto';

export default interface DeskbeeInterface {
  getBookingByUuid(uuid: string): Promise<BookingDto>;
  savePersonalBadge(personalBadgeDto: PersonalBadgeDto[]): Promise<any>;
  checkInByUser(events: CheckInDto[]): Promise<any>;
}
