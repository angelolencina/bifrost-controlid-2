import { v4 as uuid } from 'uuid';
import { Person } from '../../../dto/person.dto';
import { Place } from '../../../dto/place.dto';
import * as moment from 'moment';

const ACTION_CREATED = 'created';
const ACTION_DELETED = 'deleted';

type BookingProps = {
  id?: string;
  uuid: string;
  event: string;
  email: string;
  start_date: string;
  end_date: string;
  state: string;
  action: string;
  person: Person;
  place: Place;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export class BookingRewardDto {
  #id: string;
  #uuid: string;
  #event: string;
  #email: string;
  #start_date: Date;
  #end_date: Date;
  #state: string;
  #action: string;
  #person: Person;
  #place: Place;
  #created_at: Date;
  #updated_at: Date;
  #sync_date?: Date | undefined;
  #deleted_at?: Date | undefined;

  constructor(props: BookingProps) {
    this.#id = props?.id ? props.id : uuid();
    this.#uuid = props.uuid;
    this.#event = props.event;
    this.#email = props.email;
    this.#start_date = new Date(props.start_date);
    this.#end_date = new Date(props.end_date);
    this.#state = props.state;
    this.#action = props.action;
    this.#person = props.person;
    this.#place = props.place;
    this.#created_at = new Date(props.created_at);
    this.#updated_at = new Date(props.updated_at);
    this.#deleted_at = props?.deleted_at
      ? new Date(props.deleted_at)
      : undefined;
  }

  get id(): string {
    return this.#id;
  }

  get uuid(): string {
    return this.#uuid;
  }

  get event(): string {
    return this.#event;
  }

  get email(): string {
    return this.#email;
  }

  get start_date(): Date {
    return this.#start_date;
  }

  get end_date(): Date {
    return this.#end_date;
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

  get deleted_at(): Date | undefined {
    return this.#deleted_at;
  }

  get sync_date(): Date | undefined {
    return this.#sync_date;
  }

  isNew(): boolean {
    return this?.action === ACTION_CREATED;
  }

  isDeleted(): boolean {
    return this?.action === ACTION_DELETED;
  }

  isBeforehand(): boolean {
    return moment(this.start_date).diff(moment(), 'days') >= 2;
  }

  setSync(date: Date) {
    this.#sync_date = date;
  }

  toJson() {
    return {
      id: this.id,
      uuid: this.uuid,
      event: this.#event,
      email: this.#email,
      start_date: this.start_date,
      end_date: this.end_date,
      state: this.state,
      action: this.action,
      person: this.person,
      place: this.place,
      created_at: this.created_at,
      updated_at: this.updated_at,
      sync_date: this.sync_date,
      deleted_at: this.deleted_at,
    };
  }
}
