import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationEntity } from './entities/configuration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { apiDeskbee, getBearerToken } from './apis/deskbee-base.api';
import { isValidToken } from './utils/is-token-expired.util';

@Injectable()
export class AppService {
  public logger = new Logger(AppService.name);
  public account = process.env.ACCOUNT;
  constructor(
    @InjectRepository(ConfigurationEntity)
    private entranceRepository: Repository<ConfigurationEntity>,
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

  async getConfigCrendential(): Promise<any> {
    return this.entranceRepository.findOne({
      where: {
        account: this.account,
      },
    });
  }

  async getToken() {
    this.logger.log(`getToken account: ${this.account}`);
    const config = await this.getConfigCrendential();
    if (config) {
      if (isValidToken(config.token_expires_in)) {
        return config.token;
      }
      return getBearerToken(config.credential).then(async (res) => {
        await this.entranceRepository.update(
          { account: this.account },
          {
            token: res.access_token,
            token_expires_in: new Date(
              new Date().getTime() + res.expires_in * 1000,
            ).toISOString(),
          },
        );
        return `Bearer ${res.data.access_token}`;
      });
    }
  }
  async saveToken(response: any) {
    this.logger.log(`saveToken account: ${this.account}`);
    console.log('response', response);
  }
}
