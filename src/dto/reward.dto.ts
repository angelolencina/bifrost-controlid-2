import { formatDateToDatabase } from '../utils/format-date.util';
import { Person } from './person.dto';
import { Place } from './place.dto';
import { v4 as uuid } from 'uuid';
import { setDateToLocal } from '../utils/set-date-to-local.util';
import moment from 'moment';

type RewardProps = {
  id?: string;
  booking_uuid: string;
  email: string;
  state: string;
  startDate?: Date;
  event: string;
  reward_type: string;
  action: string;
  person: Person;
  place: Place;
};

export class RewardDto {
  #id: string;
  #booking_uuid: string;
  #email: string;
  #event: string;
  #state: string;
  #awarded_points: number;
  #reward_type: string;
  #action: string;
  #person: Person;
  #place: Place;
  #created_at: Date;
  #updated_at: Date;
  #sync_date?: Date | null | undefined;
  #deleted_at?: Date | null | undefined;
  public static BEFORE_BOOKING = 'beforehand_booking';
  public static AWARD_WINNING = 'award_winning';
  public static BY_CHECK_IN = 'by_check_in';
  public static EXPIRED_BOOKING = 'expired_booking';
  public static CANCELED_BOOKING = 'canceled_booking';

  constructor(props: RewardProps) {
    this.#id = props?.id ? props.id : uuid();
    this.#booking_uuid = props.booking_uuid;
    this.#email = props.email;
    this.#event = props.event;
    this.#state = props.state;
    this.#reward_type = props.reward_type;
    this.#awarded_points = RewardDto.convertToPoints(props.reward_type);
    this.#action = props.action;
    this.#person = props.person;
    this.#place = props.place;
    this.#created_at = new Date();
    this.#updated_at = new Date();
    this.#deleted_at = undefined;
  }

  static convertToPoints(rewardType: string): number {
    switch (rewardType) {
      case RewardDto.BEFORE_BOOKING:
        return 1;
      case RewardDto.AWARD_WINNING:
        return 10;
      case RewardDto.BY_CHECK_IN:
        return 1;
      case RewardDto.EXPIRED_BOOKING:
        return -1;
      case RewardDto.CANCELED_BOOKING:
        return -1;
      default:
        return 0;
    }
  }

  extraPoint(startDate: Date): number {
    if (!startDate) {
      return 0;
    }
    const beforeHand = moment().diff(moment(startDate), 'days') >= 2;
    return beforeHand ? 1 : 0;
  }

  get id(): string {
    return this.#id;
  }

  get booking_uuid(): string {
    return this.#booking_uuid;
  }

  get email(): string {
    return this.#email;
  }

  get state(): string {
    return this.#state;
  }

  get event(): string {
    return this.#event;
  }

  get reward_type(): string {
    return this.#reward_type;
  }

  get awarded_points(): number {
    return this.#awarded_points;
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

  get deleted_at(): Date | null | undefined {
    return this.#deleted_at;
  }

  get sync_date(): Date | null | undefined {
    return this.#sync_date;
  }

  setSync(date: Date | null) {
    this.#sync_date = date;
  }

  setAwardedPoints(points: number) {
    this.#awarded_points = points;
  }

  toJson() {
    return {
      id: this.id,
      booking_uuid: this.booking_uuid,
      email: this.email,
      state: this.state,
      event: this.event,
      action: this.action,
      awarded_points: this.awarded_points,
      reward_type: this.reward_type,
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
    return new RewardDto({
      id: json.id,
      booking_uuid: json.uuid,
      email: json.email,
      state: json.state,
      reward_type: json.reward_type,
      event: json.event,
      action: json.action,
      person: JSON.parse(json.person),
      place: JSON.parse(json.place),
    });
  }
}
