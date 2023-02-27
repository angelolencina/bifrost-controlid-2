import { formatDateToDatabase } from '../utils/format-date.util';
import { Person } from './person.dto';
import { Place } from './place.dto';
import { Tolerance } from './tolerance.dto';
import { v4 as uuid } from 'uuid';
import { setDateToLocal } from '../utils/set-date-to-local.util';

type BookingProps = {
  id?: string;
  uuid: string;
  start_date: Date;
  end_date: Date;
  tolerance: Tolerance | null;
  state: string;
  action: string;
  person: Person;
  place: Place;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export class BookingParsedDto {
  #id: string;
  #uuid: string;
  #start_date: Date;
  #end_date: Date;
  #tolerance: Tolerance | null;
  #state: string;
  #action: string;
  #person: Person;
  #place: Place;
  #created_at: Date;
  #updated_at: Date;
  #sync_date: Date | null;
  #deleted_at: Date | null;

  constructor(props: BookingProps) {
    this.#id = props?.id ? props.id : uuid();
    this.#uuid = props.uuid;
    this.#start_date = props.start_date;
    this.#end_date = props.end_date;
    this.#tolerance = props.tolerance;
    this.#state = props.state;
    this.#action = props.action;
    this.#person = props.person;
    this.#place = props.place;
    this.#created_at = props.created_at;
    this.#updated_at = props.updated_at;
    this.#deleted_at = props.deleted_at;
  }

  get id(): string {
    return this.#id;
  }

  get uuid(): string {
    return this.#uuid;
  }

  get start_date(): Date {
    return this.#start_date;
  }

  get end_date(): Date {
    return this.#end_date;
  }

  get tolerance(): Tolerance | null {
    return this.#tolerance;
  }

  get state(): string {
    return this.#state;
  }

  get action(): string {
    return this.#action;
  }

  get person(): Person {
    return this.#person;
  }

  get place(): Place {
    return this.#place;
  }

  get created_at(): Date {
    return this.#created_at;
  }

  get updated_at(): Date {
    return this.#updated_at;
  }

  get deleted_at(): Date | null {
    return this.#deleted_at;
  }

  get sync_date(): Date | null {
    return this.#sync_date;
  }

  setSync(date: Date | null) {
    this.#sync_date = date;
  }

  toJson() {
    return {
      id: this.id,
      uuid: this.uuid,
      start_date: formatDateToDatabase(setDateToLocal(this.start_date)),
      end_date: formatDateToDatabase(setDateToLocal(this.end_date)),
      tolerance: this.tolerance
        ? JSON.stringify({
            ...this.tolerance,
            checkin_max_time: formatDateToDatabase(
              setDateToLocal(this.tolerance.checkin_max_time),
            ),
            checkin_min_time: formatDateToDatabase(
              setDateToLocal(this.tolerance.checkin_min_time),
            ),
          })
        : undefined,
      state: this.state,
      action: this.action,
      person: JSON.stringify(this.person),
      place: JSON.stringify(this.place),
      created_at: formatDateToDatabase(setDateToLocal(this.created_at)),
      updated_at: formatDateToDatabase(this.updated_at),
      sync_date: this.sync_date
        ? formatDateToDatabase(setDateToLocal(this.sync_date))
        : undefined,
      deleted_at: this.deleted_at
        ? formatDateToDatabase(setDateToLocal(this.deleted_at))
        : undefined,
    };
  }

  static buildFromJson(json: any) {
    const tolerance = json.tolerance ? JSON.parse(json.tolerance) : null;
    if (tolerance) {
      tolerance.checkin_max_time = new Date(tolerance.checkin_max_time);
      tolerance.checkin_min_time = new Date(tolerance.checkin_min_time);
    }
    return new BookingParsedDto({
      id: json.id,
      uuid: json.uuid,
      start_date: new Date(json.start_date),
      end_date: new Date(json.end_date),
      tolerance: tolerance ? tolerance : null,
      state: json.state,
      action: json.action,
      person: JSON.parse(json.person),
      place: JSON.parse(json.place),
      created_at: new Date(json.created_at),
      updated_at: new Date(json.updated_at),
      deleted_at: json.deleted_at ? new Date(json.deleted_at) : null,
    });
  }
}
