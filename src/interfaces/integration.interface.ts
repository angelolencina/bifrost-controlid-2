import { BookingParsedDto } from '../dto/booking-parsed.dto';
export default interface IntegrationInterface {
  handleAccessControl(booking: BookingParsedDto): void;
  automateCheckIn(): void;
  generateQrCode(): void;
}
