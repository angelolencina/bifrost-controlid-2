import { BookingDto } from '../dto/booking.dto';
import { CheckInDto } from '../dto/checkin.dto';
import { PersonalBadgeDto } from '../dto/personal-badge.dto';

export default interface DeskbeeInterface {
  getBookingByUuid(uuid: string): Promise<BookingDto>;
  savePersonalBadge(personalBadgeDto: PersonalBadgeDto[]): Promise<any>;
  checkInByUser(events: CheckInDto[]): Promise<any>;
}
