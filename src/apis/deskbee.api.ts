import { Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { CheckInDto } from '../dtos/checkin.dto';
import { PersonalBadgeDto } from '../dtos/personal-badge.dto';
import Deskbee from '../interfaces/deskbee.interface';

export class ApiDeskbee implements Deskbee {
  public logger = new Logger('ApiDeskbee');
  public api: AxiosInstance;
  static baseUrl: string = process.env.DESKBEE_API_URL || '';
  constructor() {
    this.api = axios.create({
      baseURL: ApiDeskbee.baseUrl,
      headers: { 'Content-Type': `application/json; charset=UTF-8` },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    this.api.interceptors.request.use(
      async (config) => {
        config.headers['Authorization'] = await ApiDeskbee.getBearerToken();
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  static getBearerToken = () => {
    const body = {
      grant_type: 'client_credentials',
      client_id: process.env.DESKBEE_API_CLIENT_ID,
      client_secret: process.env.DESKBEE_API_CLIENT_SECRET,
      scope: process.env.DESKBEE_API_SCOPE,
    };
    const config = {
      headers: { 'Content-Type': `application/json; charset=UTF-8` },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    return axios
      .post(`${this.baseUrl}/v1.1/oauth/token`, body, config)
      .then((res) => `Bearer ${res.data.access_token}`)
      .catch((e) => {
        throw new Error(`Error get token: ${e.message})`);
      });
  };

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
