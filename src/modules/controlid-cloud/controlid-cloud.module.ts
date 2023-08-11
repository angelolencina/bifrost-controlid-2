import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { AccountRepository } from '../../database/repositories/account.repository';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { AccountEntity } from '../../entities/account.entity';
import { BookingEntity } from '../../entities/booking.entity';
import { ConfigurationEntity } from '../../entities/configuration.entity';
import { PersonalBadgeEntity } from '../../entities/personal-badge.entity';
import { ApiControlid } from '../controlid-on-premise/api/controlid.api';
import { CONTROLID_CONFIG_OPTIONS } from '../controlid-on-premise/constants/controlid-options.constant';
import { ControlidOnPremiseService } from '../controlid-on-premise/controlid.service';
import { CronService } from '../controlid-on-premise/cron.service';
import ControlidRepository from '../controlid-on-premise/database/repositories/controlid.repository';
import ControlidCloudAsyncOptions from './types/controlid-cloud-async-options.type';

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
        ]),
        DeskbeeModule,
      ],
      providers: [
        {
          provide: CONTROLID_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AccountRepository,
        ControlidOnPremiseService,
        ApiControlid,
        ControlidRepository,
        CronService,
      ],
      exports: [ControlidOnPremiseService],
    };
  }
}
