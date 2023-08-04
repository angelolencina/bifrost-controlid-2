export class UserDeskbeeDto {
  uuid: string;
  name: string;
  name_display: string;
  email: string;
  enrollment: string;
  source: string;
  access_type: string;
  profile: string;
  locale: { timezone: string; language: string };
  status: boolean;
  person: { uuid: string };
  created_at: string;
  updated_at: string;
}
