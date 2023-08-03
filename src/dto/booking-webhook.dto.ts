export class BookingWebhookDto {
  subscription_id: string;
  transaction_id: string;
  account: string;
  send_at: string;
  event: string;
  resource: {
    action: string;
    route: string;
    uuid: string;
  };
  included: {
    booking_uuid: string;
    start_date: string;
    end_date: string;
    person: {
      uuid: string;
      name: string;
      email: string;
      groups?: string[];
    };
    place: {
      uuid: string;
      type: string;
      name: string;
    };
    tolerance: {
      minutes: number;
      checkin_min_time: string;
      checkin_max_time: string;
    };
    status: { id: number; name: string };
  };
}
