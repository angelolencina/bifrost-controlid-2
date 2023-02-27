export class LogDto {
  timestamp: string;
  level: string;
  context: any;
  message?: string;
  service_name: string;
  account_id?: string;
  merchant_id?: string;
  driver_id?: string;
  order_id?: string;
  request_id?: string;
}
