import { BookingParsedDto } from '../dto/booking-parsed.dto';
import { BookingWebhookDto } from '../dto/booking-webhook.dto';

export const parseBooking = (
  bookingWebHook: BookingWebhookDto,
): BookingParsedDto => {
  const tolerance = {
    minutes: bookingWebHook.included.tolerance.minutes,
    checkin_max_time: new Date(
      bookingWebHook.included.tolerance.checkin_max_time,
    ),
    checkin_min_time: new Date(
      bookingWebHook.included.tolerance.checkin_min_time,
    ),
  };
  return new BookingParsedDto({
    uuid: bookingWebHook.included.booking_uuid,
    event: bookingWebHook.event,
    email: bookingWebHook.included.person.email,
    start_date: new Date(bookingWebHook.included.start_date),
    end_date: new Date(bookingWebHook.included.end_date),
    state: bookingWebHook.included.status.name,
    action: bookingWebHook.resource.action,
    person: bookingWebHook.included.person,
    place: bookingWebHook.included.place,
    tolerance: bookingWebHook?.included?.tolerance?.minutes ? tolerance : null,
    created_at: new Date(bookingWebHook.send_at),
    updated_at: new Date(bookingWebHook.send_at),
    deleted_at:
      bookingWebHook.resource.action === 'deleted'
        ? new Date(bookingWebHook.send_at)
        : null,
  });
};
