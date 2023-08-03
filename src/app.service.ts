import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationEntity } from './entities/configuration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { apiDeskbee, getBearerToken } from './apis/deskbee-base.api';
import { isValidToken } from './utils/is-token-expired.util';
import { AccountEntity } from './entities/account.entity';
import AccountFactory from './factory/account.factory';
import { DeskbeeService } from './deskbee/deskbee.service';

@Injectable()
export class AppService {
  public logger = new Logger(AppService.name);
  public account = process.env.ACCOUNT;
  constructor(
    @InjectRepository(ConfigurationEntity)
    private configRepository: Repository<ConfigurationEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    private readonly deskbeeService: DeskbeeService,
  ) {
    apiDeskbee.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  async getConfigCredential(): Promise<any> {
    return this.configRepository.findOne({
      where: {
        account: this.account,
      },
    });
  }

  async getToken() {
    const config = await this.getConfigCredential();
    if (config) {
      if (isValidToken(config.token_expires_in)) {
        return config.token;
      }
      return getBearerToken(config.credential).then(async (res) => {
        await this.configRepository.update(
          { account: this.account },
          {
            token: res.access_token,
            token_expires_in: new Date(
              new Date().getTime() + res.expires_in * 1000,
            ).toISOString(),
          },
        );
        return res.data.access_token;
      });
    }
  }
  async saveToken(response: any) {
    this.logger.log(`saveToken account: ${this.account}`);
    console.log('response', response);
  }

  async saveAccount(account: any) {
    this.logger.log(`saveAccount account: ${this.account}`);
    account = AccountFactory.createAccount(account);
    await this.accountRepository.upsert([account.toJson()], ['code']);
    return this.accountRepository.findOne({ where: { code: account.code } });
  }

  public getBookings() {
    return this.deskbeeService.searchBookings({});
  }
}
