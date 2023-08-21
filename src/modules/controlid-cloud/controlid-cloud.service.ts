import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingWebhookDto } from '../../dto/booking-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { config } from 'dotenv';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { DeskbeeService } from '../../deskbee/deskbee.service';
import { UserWebhookDto } from '../../dto/user-webhook.dto';
import { parseBooking } from '../../utils/parse-booking.util';
import { isToday } from '../../utils/is-today.util';
import { ControlidCloudDto } from './dto/controlid-cloud-request.dto';
import { CONTROLID_CONFIG_OPTIONS } from '../controlid-on-premise/constants/controlid-options.constant';
import { ApiControlidCloud } from './api/controlid.api';
import { CronService } from './cron.service';

import { AccountRepository } from '../../database/repositories/account.repository';
import { isValidToken } from '../../utils/is-token-expired.util';
import { Repository } from 'typeorm';
import { ConfigurationEntity } from '../../entities/configuration.entity';

config();

const BOOKING_EVENT = 'booking';
const USER_EVENT = 'user';
const SYSTEM = 'controlid-cloud';

@Injectable()
export class ControlidCloudService {
  public logger = new Logger('controlid-cloud-service');
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidCloudDto,
    private readonly apiControlid: ApiControlidCloud,
    @InjectRepository(BookingEntity)
    private bookingRepository: BookingRepository,
    @InjectRepository(ConfigurationEntity)
    private configRepo: Repository<ConfigurationEntity>,
    private readonly accountRepo: AccountRepository,
    private readonly deskbeeService: DeskbeeService,
    private cronService: CronService,
  ) {}

  @OnEvent(BOOKING_EVENT)
  async handleBooking(bookingWebhook: BookingWebhookDto) {
    if (!this.options.isActive) return;

    const { email } = bookingWebhook.included.person;
    const userGroups = await this.getUserGroups(email);
    bookingWebhook.included.person.groups = userGroups;

    if (this.shouldProcessAccessControl(email, userGroups)) {
      this.processAccessControl(bookingWebhook);
    }
  }

  private shouldProcessAccessControl(
    email: string,
    userGroups: string[],
  ): boolean {
    if (!this.options.accessControlByLimit) return false;

    if (this.isExcludedEmail(email) || this.isExcludedGroup(userGroups))
      return false;

    if (
      this.isInHomologationEmail(email) ||
      this.isAccessControlLimitedToGroup(userGroups)
    )
      return true;

    return true;
  }

  private isExcludedEmail(email: string): boolean {
    return this.options.mailsExcluded?.includes(email) ?? false;
  }

  private isInHomologationEmail(email: string): boolean {
    return (
      (this.options.inHomologation &&
        this.options.mailsInHomologation?.includes(email)) ??
      false
    );
  }

  private isExcludedGroup(userGroups: string[]): boolean {
    return (
      this.options.deskbeeExcludedGroups?.some((group) =>
        userGroups?.includes(group),
      ) ?? false
    );
  }

  private isAccessControlLimitedToGroup(userGroups: string[]): boolean {
    return (
      (this.options.limitAccessControlToGroupsDeskbee &&
        userGroups?.some((uuid) =>
          this.options.deskbeeGroupUuids?.includes(uuid),
        )) ??
      false
    );
  }

  @OnEvent(USER_EVENT)
  async handleUser(userWebhook: UserWebhookDto) {
    if (userWebhook.resource.action === 'created') {
      const user = await this.deskbeeService.getUser(userWebhook.resource.uuid);
      if (!user) {
        return;
      }
      //this.controlidRepository.createUser(user);
    }
    if (userWebhook.resource.action === 'updated') {
      const user = await this.deskbeeService.getUser(userWebhook.resource.uuid);
      if (!user) {
        return;
      }
      //this.controlidRepository.updateUser(user);
    }

    if (userWebhook.resource.action === 'deleted') {
      //this.controlidRepository.deleteUser(userWebhook.included.email);
    }
  }

  async processAccessControl(bookingWebhook: BookingWebhookDto) {
    this.logger.log(
      `Processing AccessControl : ${bookingWebhook.resource.uuid} - ${bookingWebhook.included.status.name} - ${bookingWebhook.included.person.email}`,
    );
    const newBooking = parseBooking(bookingWebhook).toJson();
    if (isToday(newBooking.start_date) && newBooking.action === 'created') {
      const email = bookingWebhook.included.person.email;
      try {
        await this.grantUserAccessToday(
          email,
          newBooking.start_date,
          newBooking.end_date,
        );
        newBooking.sync_date = new Date();
      } catch (error) {
        this.logger.error(`Error on grant access to ${email} => ${error}`);
      }
    }
    newBooking.sync_date = undefined;
    this.bookingRepository.upsert(newBooking, ['uuid', 'event', 'email']);
  }

  async revokeUserAccess(email: string) {
    this.logger.log(`Revoking access to last day for ${email}`);
    try {
      //await this.controlidRepository.revokeUserAccess(email);
      this.apiControlid.syncAll();
    } catch (error) {
      this.logger.error(`Error on revoke access to ${email} => ${error}`);
    }
  }

  async grantUserAccessToday(email: string, start: Date, end: Date) {
    this.logger.log(`Granting access today for ${email}`);
    try {
      //await this.controlidRepository.grantAccessToToday(email, start, end);
      this.apiControlid.syncAll();
    } catch (error) {
      this.logger.error(`Error on grant access to ${email} => ${error}`);
    }
  }

  getUserGroups(email: string) {
    return this.deskbeeService.getUserGroups(email);
  }

  async getConfigCredential(): Promise<any> {
    const [account] = await this.accountRepo.find();
    if (!account?.integration?.controlidCloud) {
      throw new Error('Account not found');
    }
    const config = await this.configRepo.findOne({
      where: {
        system: SYSTEM,
      },
    });
    if (!config) {
      const {
        integration: { controlidCloud },
      } = account;
      return this.saveConfigCredential(controlidCloud.api);
    }
    return config;
  }

  async getToken(): Promise<string | undefined> {
    const config = await this.getConfigCredential();

    if (isValidToken(config?.token_expires_in)) {
      return config.token;
    }

    return this.apiControlid.getBearerToken().then(async (res) => {
      const dateString = res.expiration?.replace(
        /(\d{4}-\d{2}-\d{2})(\d{2}:\d{2}:\d{2})/,
        '$1T$2',
      );
      await this.configRepo.update(
        { system: SYSTEM },
        {
          token: res.token,
          token_expires_in: dateString,
        },
      );
      return `Bearer ${res.access_token}`;
    });
  }

  async saveConfigCredential(api: any): Promise<any> {
    this.logger.log('saving new credential');
    const [account] = await this.accountRepo.find();
    if (!account) throw new Error('Account not found');
    return this.configRepo.save({
      system: SYSTEM,
      credential: { email: api.username, password: api.password },
    });
  }
}
