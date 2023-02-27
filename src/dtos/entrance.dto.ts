import { formatDateToDatabase } from '../utils/format-date.util';
import { setDateToLocal } from '../utils/set-date-to-local.util';

type EntranceProps = {
  email: string;
  idDevice: number;
  deviceName: string;
  reader: number;
  idArea: number;
  area: string;
  event: number;
  createdAt: string;
};
export class EntranceDto {
  #email: string;
  #id_device: number;
  #device_name: string;
  #reader: number;
  #id_area: number;
  #area: string;
  #event: number;
  #created_at: string;
  constructor(props: EntranceProps) {
    this.#email = props.email;
    this.#id_device = props.idDevice;
    this.#device_name = props.deviceName;
    this.#reader = props.reader;
    this.#id_area = props.idArea;
    this.#area = props.area;
    this.#event = props.event;
    this.#created_at = props.createdAt;
  }
  get email(): string {
    return this.#email;
  }
  get idDevice(): number {
    return this.#id_device;
  }
  get deviceName(): string {
    return this.#device_name;
  }
  get reader(): number {
    return this.#reader;
  }
  get idArea(): number {
    return this.#id_area;
  }
  get area(): string {
    return this.#area;
  }
  get event(): number {
    return this.#event;
  }
  get createdAt(): string {
    return this.#created_at;
  }

  toJson() {
    return {
      email: this.email,
      id_device: this.idDevice,
      device_name: this.deviceName,
      reader: this.reader,
      id_area: this.idArea,
      area: this.area,
      event: this.event,
      created_at: this.createdAt,
    };
  }

  toCheckinDto() {
    return {
      device: this.idDevice,
      person: this.email,
      date: formatDateToDatabase(setDateToLocal(new Date(this.createdAt))),
      entrance: 1,
    };
  }
}
