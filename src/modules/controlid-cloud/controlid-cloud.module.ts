import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { AccountRepository } from '../../database/repositories/account.repository';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { AccountEntity } from '../../entities/account.entity';
import { BookingEntity } from '../../entities/booking.entity';
import { ConfigurationEntity } from '../../entities/configuration.entity';
import { PersonalBadgeEntity } from '../../entities/personal-badge.entity';
import ControlidCloudAsyncOptions from './types/controlid-cloud-async-options.type';
import { ApiControlidCloud } from './api/controlid.api';
import { ControlidCloudService } from './controlid-cloud.service';
import { CronService } from './cron.service';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-cloud-options.constant';
import { SettingsEntity } from '../../entities/settings.entity';

@Module({})
export class ControlidCloudModule {
  static registerAsync(options: ControlidCloudAsyncOptions): DynamicModule {
    return {
      module: ControlidCloudModule,
      imports: [
        TypeOrmModule.forFeature([
          ConfigurationEntity,
          AccountEntity,
          EntranceLogEntity,
          BookingEntity,
          PersonalBadgeEntity,
          SettingsEntity,
        ]),
        DeskbeeModule,
      ],
      providers: [
        {
          provide: CONTROLID_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        ControlidCloudService,
        AccountRepository,
        ApiControlidCloud,
        CronService,
      ],
      exports: [ControlidCloudService],
    };
  }
}
