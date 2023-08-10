import { BookingWebhookDto } from '../../../dto/booking-webhook.dto';
import { BookingRewardDto } from '../dto/booking-reward.dto';

export const parseBookingReward = (
  bookingWebHook: BookingWebhookDto,
): BookingRewardDto => {
  return new BookingRewardDto({
    uuid: bookingWebHook.included.booking_uuid,
    event: bookingWebHook.event,
    email: bookingWebHook.included.person.email,
    start_date: bookingWebHook.included.start_date,
    end_date: bookingWebHook.included.end_date,
    state: bookingWebHook.included.status.name,
    action: bookingWebHook.resource.action,
    person: bookingWebHook.included.person,
    place: bookingWebHook.included.place,
    created_at: bookingWebHook.send_at,
    updated_at: bookingWebHook.send_at,
    deleted_at:
      bookingWebHook.resource.action === 'deleted'
        ? bookingWebHook.send_at
        : null,
  });
};
