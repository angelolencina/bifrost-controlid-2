export class UserWebhookDto {
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
    email: string;
    personal_badge: string;
  };
}
