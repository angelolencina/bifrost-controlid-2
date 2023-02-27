import { BookingParsedDto } from '../dtos/booking-parsed.dto';
import { BookingWebhookDto } from '../dtos/booking-webhook.dto';
import { BookingDto } from '../dtos/booking.dto';

export const parseBooking = (
  booking: BookingDto,
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
    uuid: booking.uuid,
    start_date: new Date(booking.start_date),
    end_date: new Date(booking.end_date),
    state: bookingWebHook.included.status.name,
    action: bookingWebHook.resource.action,
    person: booking.person,
    place: booking.place,
    tolerance: bookingWebHook?.included?.tolerance?.minutes ? tolerance : null,
    created_at: new Date(booking.created_at),
    updated_at: new Date(booking.updated_at),
    deleted_at: booking?.deleted_at ? new Date(booking.deleted_at) : null,
  });
};

const parseTolerance = (tolerance: any) => {
  return {
    minutes: tolerance.minutes,
    checkin_max_time: new Date(tolerance.checkin_max_time),
    checkin_min_time: new Date(tolerance.checkin_min_time),
  };
};
