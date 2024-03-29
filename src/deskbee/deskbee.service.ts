import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { apiDeskbee, getBearerToken } from '../apis/deskbee-base.api';
import { ConfigurationEntity } from '../entities/configuration.entity';
import { isValidToken } from '../utils/is-token-expired.util';
import { AxiosInstance } from 'axios';
import { CheckInDto } from '../dto/checkin.dto';
import { PersonalBadgeDto } from '../dto/personal-badge.dto';
import { sortByStartDateDesc } from '../utils/sort-by-date.util';
import { AccountEntity } from '../entities/account.entity';

type TSearchBookings = {
  search?: string;
  limit?: number;
  url?: string;
  _bookings?: any[];
};

const SYSTEM = 'deskbee';

@Injectable()
export class DeskbeeService {
  private readonly logger = new Logger(DeskbeeService.name);
  private readonly api: AxiosInstance = apiDeskbee;
  constructor(
    @InjectRepository(ConfigurationEntity)
    private configRepository: Repository<ConfigurationEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) {
    apiDeskbee.interceptors.request.use(
      async (config) => {
        config.headers['Authorization'] = await this.getToken();
        return config;
      },
      function (error) {
        new Logger(DeskbeeService.name).error(
          `Interceptor: Error to get token`,
        );

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

  public async searchBookings({
    search = '',
    limit = 400,
    url,
    _bookings = [],
  }: TSearchBookings): Promise<any> {
    const bookings = _bookings;
    const urlDefault = `/v1.1/bookings?search=${search}&limit=${limit}&include=checkin;min_tolerance;squads`;
    url = !!url ? url : urlDefault;
    const data = await this.api.get(url).then((res) => res.data);

    if (data?.data?.length > 0) {
      bookings.push(...data.data);
    }

    if (data?.links?.next) {
      return this.searchBookings({
        limit: 400,
        url: data?.links?.next,
        _bookings: bookings,
      });
    }
    return bookings?.length ? sortByStartDateDesc(bookings) : [];
  }

  sendPersonalBadge = (personalBadgeDto: PersonalBadgeDto[]) => {
    return this.api
      .post(`/v1.1/integrations/personal-badge`, personalBadgeDto)
      .then((res) => res.data.data)
      .catch((e) => {
        this.logger.error(`Error Send PersonalBadge: ${e.message}`);
      });
  };

  getUser = (userUuid: string) => {
    return this.api
      .get(`/v1.1/users/${userUuid}`)
      .then((res) => {
        return res.data.data;
      })
      .catch((e) => {
        this.logger.error(`Error getUser: ${e.message}`);
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

  getUserGroups(email: string) {
    return this.api
      .get(`/v1.1/users/?search=email:${email}&include=squads`)
      .then((res) => {
        if (res?.data?.data?.length > 0) {
          return res.data.data[0].squads?.map((squad: any) => squad.uuid);
        }
      })
      .catch((e) => {
        this.logger.error(`Error GetUserGroups: ${e.message}`);
        return [];
      });
  }

  async getConfigCredential(): Promise<any> {
    const [account] = await this.accountRepository.find();
    if (!account) throw new Error('Account not found');
    const config = await this.configRepository.findOne({
      where: {
        system: SYSTEM,
      },
    });
    if (!config) {
      return this.saveConfigCredential();
    }
    return config;
  }

  async getToken(): Promise<string | undefined> {
    const config = await this.getConfigCredential();
    const credential = config?.credential ?? this.getEnvCredential();

    if (isValidToken(config?.token_expires_in)) {
      return config.token;
    }

    return getBearerToken(credential).then(async (res) => {
      this.logger.log(`New deskbee token generated`);
      await this.configRepository.update(
        { system: SYSTEM },
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
    const [account] = await this.accountRepository.find();
    if (!account) throw new Error('Account not found');
    return this.configRepository.save({
      system: SYSTEM,
      credential: this.getEnvCredential(),
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
