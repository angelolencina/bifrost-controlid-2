import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { apiDeskbee, getBearerToken } from '../apis/deskbee-base.api';
import { ConfigurationEntity } from '../entities/configuration.entity';
import { isValidToken } from '../utils/is-token-expired.util';
import { AxiosInstance } from 'axios';
import { CheckInDto } from '../dtos/checkin.dto';
import { PersonalBadgeDto } from '../dtos/personal-badge.dto';

@Injectable()
export class DeskbeeService {
  private readonly logger = new Logger(DeskbeeService.name);
  private readonly account = process.env.ACCOUNT;
  private readonly api: AxiosInstance = apiDeskbee;
  constructor(
    @InjectRepository(ConfigurationEntity)
    private configRepository: Repository<ConfigurationEntity>,
  ) {
    apiDeskbee.interceptors.request.use(
      async (config) => {
        config.headers['Authorization'] = await this.getToken();
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

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

  checkInByUser = (events: CheckInDto[]) => {
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

  async getConfigCredential(): Promise<any> {
    const config = await this.configRepository.findOne({
      where: {
        account: this.account,
      },
    });
    if (!config) {
      return this.saveConfigCredential();
    }
    return config;
  }

  async getToken(): Promise<string | undefined> {
    this.logger.log(`getToken account: ${this.account}`);
    const config = await this.getConfigCredential();
    const credential = config?.credential ?? this.getEnvCredential();

    if (isValidToken(config?.token_expires_in)) {
      return config.token;
    }

    return getBearerToken(credential).then(async (res) => {
      await this.configRepository.update(
        { account: this.account },
        {
          token: res.access_token,
          token_expires_in: new Date(
            new Date().getTime() + res.expires_in * 1000,
          ).toISOString(),
        },
      );
      return `Bearer ${res.access_token}`;
    });
  }

  async saveConfigCredential(): Promise<any> {
    this.logger.log('saving new credential');
    return this.configRepository.save({
      account: this.account,
      credential: JSON.stringify(this.getEnvCredential()),
    });
  }
  getEnvCredential() {
    return {
      grant_type: 'client_credentials',
      client_id: process.env.DESKBEE_API_CLIENT_ID,
      client_secret: process.env.DESKBEE_API_CLIENT_SECRET,
      scope: process.env.DESKBEE_API_SCOPE,
    };
  }
}
