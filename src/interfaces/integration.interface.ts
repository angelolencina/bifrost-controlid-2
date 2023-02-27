import { BookingParsedDto } from '../dtos/booking-parsed.dto';
export default interface IntegrationInterface {
  handleAccessControl(booking: BookingParsedDto): void;
  automateCheckIn(): void;
  generateQrCode(): void;
}
