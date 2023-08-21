import { formatDateString } from '../utils/format-date-string.util';

type EntranceProps = {
  email: string;
  idDevice: number;
  deviceName: string;
  logId: number;
  reader?: number;
  idArea?: number;
  area?: string;
  event?: string;
  event_description?: string;
  createdAt: string;
};
export class EntranceDto {
  #email: string;
  #id_device: number;
  #log_id: number;
  #device_name: string;
  #reader?: number;
  #id_area?: number;
  #area?: string;
  #event?: string;
  #event_description?: string;
  #created_at: Date;
  constructor(props: EntranceProps) {
    this.#email = props.email;
    this.#id_device = props.idDevice;
    this.#log_id = props.logId;
    this.#device_name = props.deviceName;
    this.#reader = props.reader;
    this.#id_area = props.idArea;
    this.#area = props.area;
    this.#event = props.event;
    this.#event_description = props.event_description;
    this.#created_at = new Date(props.createdAt);
  }
  get email(): string {
    return this.#email;
  }
  get idDevice(): number {
    return this.#id_device;
  }
  get logId(): number {
    return this.#log_id;
  }
  get deviceName(): string {
    return this.#device_name;
  }
  get reader(): number | undefined {
    return this.#reader;
  }
  get idArea(): number | undefined {
    return this.#id_area;
  }
  get area(): string | undefined {
    return this.#area;
  }
  get event(): string | undefined {
    return this.#event;
  }
  get eventDescription(): string | undefined {
    return this.#event_description;
  }
  get createdAt(): Date {
    return this.#created_at;
  }

  toJson() {
    return {
      email: this.email,
      id_device: this.idDevice,
      log_id: this.logId,
      device_name: this.deviceName,
      reader: this.reader,
      id_area: this.idArea,
      area: this.area,
      event: this.event,
      created_at: this.createdAt,
    };
  }

  toCheckInDto() {
    return {
      device: this.idDevice,
      person: this.email,
      date: formatDateString(this.createdAt.toISOString()),
      entrance: 1,
    };
  }
}
