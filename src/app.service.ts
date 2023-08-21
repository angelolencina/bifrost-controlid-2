import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationEntity } from './entities/configuration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { apiDeskbee } from './apis/deskbee-base.api';
import { AccountEntity } from './entities/account.entity';
import AccountFactory from './factory/account.factory';
import { DeskbeeService } from './deskbee/deskbee.service';
import { AccountRequestDto } from './dto/account-request.dto';

@Injectable()
export class AppService {
  public logger = new Logger(AppService.name);
  public account = process.env.ACCOUNT;
  constructor(
    @InjectRepository(ConfigurationEntity)
    private configRepository: Repository<ConfigurationEntity>,
    @InjectRepository(AccountEntity)
    private accountRepo: Repository<AccountEntity>,
    private readonly deskbeeService: DeskbeeService,
  ) {
    apiDeskbee.interceptors.request.use(
      async (config: any) => {
        const token = await this.getToken();
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      function (error: any) {
        return Promise.reject(error);
      },
    );
  }

  async getToken() {
    return this.deskbeeService.getToken();
  }

  async saveAccount(account: AccountRequestDto) {
    this.logger.log(`saveAccount account: ${account.accountCode}`);
    const existingIntegration = await this.accountRepo.findOne({
      where: { integration: Not('null') },
    });
    const newAccount = AccountFactory.createAccount(account).toJson();
    if (existingIntegration) {
      const { integration } = existingIntegration;
      await this.accountRepo.update(existingIntegration.id, newAccount);
      return this.accountRepo.findOne({
        where: { id: existingIntegration.id },
      });
    }
    await this.accountRepo.upsert([newAccount], ['code']);
    return this.accountRepo.findOne({
      where: { integration: Not('null') },
    });
  }

  public getBookings() {
    return this.deskbeeService.searchBookings({});
  }

  async getUserGroups(email: string) {
    return this.deskbeeService.getUserGroups(email);
  }
}
