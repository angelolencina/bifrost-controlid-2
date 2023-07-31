import { Person } from './person.dto';
import { Place } from './place.dto';
import { Thumbs } from './thumbs.dto';

export class BookingDto {
  uuid: string;
  start_date: string;
  end_date: string;
  place: Place;
  state: string;
  person: Person;
  owner: Owner;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  checkin: string | null;
  min_tolerance: 30;
}

class Owner {
  uuid: string;
  name: string;
  name_display: string;
  email: string;
  enrollment: null;
  created_at: string;
  updated_at: string;
  image: {
    uuid: string;
    url: string;
    thumbs: Thumbs;
  };
  documents: [];
}
