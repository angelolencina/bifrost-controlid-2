import { BookingParsedDto } from '../dto/booking-parsed.dto';
import { BookingWebhookDto } from '../dto/booking-webhook.dto';
export default interface IntegrationInterface {
  handleBooking(booking: BookingWebhookDto): void;
  handleUser(booking: BookingWebhookDto): void;
  automateCheckIn(): void;
  generateQrCode(): void;
  processAccessControl(booking: BookingWebhookDto): void;
  shouldProcessAccessControl(
    isInHomologationEmail: boolean,
    isExcludedEmail: boolean,
    isExcludedGroup: boolean,
  ): boolean;
}
