import { DynamicModule, Module } from '@nestjs/common';
import { ControlidOnPremiseService } from './controlid.service';
import { ApiControlid } from './api/controlid.api';
import { BookingEntity } from '../../entities/booking.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { MySqlControlidOnPremiseModule } from './database/mysql.module';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { CronService } from './cron.service';
import { AccountEntity } from '../../entities/account.entity';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOnPremiseAsyncOptions from './types/controlid-async-options.type';
import { ConfigurationEntity } from '../../entities/configuration.entity';
import DatabaseModule from './database/database.module';
import { Users } from './entities/Users.entity';
import { Cards } from './entities/Cards.entity';
import { Logs } from './entities/Logs.entity';
import ControlidRepository from './database/repositories/controlid.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { PersonalBadgeEntity } from '../../entities/personal-badge.entity';
import { AccountRepository } from '../../database/repositories/account.repository';

@Module({})
export class ControlidOnPremiseModule {
  static registerAsync(options: ControlidOnPremiseAsyncOptions): DynamicModule {
    return {
      module: ControlidOnPremiseModule,
      imports: [
        TypeOrmModule.forFeature([
          ConfigurationEntity,
          AccountEntity,
          EntranceLogEntity,
          BookingEntity,
          PersonalBadgeEntity,
        ]),
        TypeOrmModule.forFeature([Users, Cards, Logs], 'controlid'),
        DeskbeeModule,
        DatabaseModule,
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
