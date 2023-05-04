import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { CheckInDto } from '../dtos/checkin.dto';
import { PersonalBadgeDto } from '../dtos/personal-badge.dto';
import Deskbee from '../interfaces/deskbee.interface';
import { apiDeskbee } from './deskbee-base.api';

export class ApiDeskbee implements Deskbee {
  public logger = new Logger('ApiDeskbee');
  public api: AxiosInstance = apiDeskbee;

  getBookingByUuid = (uuid: string) => {
    return this.api
      .get(
        `/v1.1/bookings/${uuid}?include=checkin;min_tolerance;image;documents`,
      )
      .then((res) => res.data.data)
      .catch((e) => {
        this.logger.error(`Error GetBooking: ${e.message}`);
        throw new Error(`Error GetBooking: ${e.message}`);
      });
  };

  savePersonalBadge = (personalBadgeDto: PersonalBadgeDto[]) => {
    return this.api
      .post(`/v1.1/integrations/personal-badge`, personalBadgeDto)
      .then((res) => res.data.data)
      .catch((e) => {
        this.logger.error(`Error Send PersonalBadge: ${e.message}`);
      });
  };

  checkinByUser = (events: CheckInDto[]) => {
    this.logger.log(`Checkin on deskbee: ${events.length}  Start!`);
    return this.api
      .post(`/v1.1/integrations/checkin`, events)
      .then(() => {
        events.map((event) => {
          this.logger.log(`Checkin on deskbee: ${event.person}  Done!`);
        });
      })
      .catch((e) => {
        this.logger.error(`Error Send Checkin: ${e.message}`);
      });
  };
}
