import { BookingParsedDto } from '../dto/booking-parsed.dto';
import { BookingWebhookDto } from '../dto/booking-webhook.dto';
import { Tolerance } from '../dto/tolerance.dto';

export const parseBooking = (
  bookingWebHook: BookingWebhookDto,
): BookingParsedDto => {
  const { tolerance } = bookingWebHook.included;
  const _tolerance = tolerance
    ? {
        minutes: tolerance?.minutes,
        checkin_max_time: new Date(tolerance.checkin_max_time),
        checkin_min_time: new Date(tolerance.checkin_min_time),
      }
    : undefined;
  return new BookingParsedDto({
    uuid: bookingWebHook.included.booking_uuid,
    event: bookingWebHook.event,
    email: bookingWebHook.included.person.email,
    start_date: bookingWebHook.included.start_date,
    end_date: bookingWebHook.included.end_date,
    state: bookingWebHook.included.status.name,
    action: bookingWebHook.resource.action,
    person: bookingWebHook.included.person,
    place: bookingWebHook.included.place,
    tolerance: _tolerance,
    created_at: bookingWebHook.send_at,
    updated_at: bookingWebHook.send_at,
    deleted_at:
      bookingWebHook.resource.action === 'deleted'
        ? bookingWebHook.send_at
        : null,
  });
};
