import { DynamicModule, Module } from '@nestjs/common';
import { ControlidService } from './controlid.service';
import { ApiControlid } from './api/controlid.api';
import { BookingEntity } from '../../entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { MySqlControlidModule } from './database/mysql.module';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { CronService } from './cron.service';
import { AccountEntity } from '../../entities/account.entity';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOptions from './interface/controlid-options.interface';
import ControlidAsyncOptions from './types/controlid-async-options.type';
import { ConfigurationEntity } from '../../entities/configuration.entity';
import DatabaseModule from './database/database.module';
import { userProviders } from './providers/users.provider';
import { DataSource } from 'typeorm';
import { Users } from './entities/Users.entity';
import { Cards } from './entities/Cards.entity';
import { Logs } from './entities/Logs.entity';
import ControlidRepository from './database/repositories/controlid.repository';

@Module({})
export class ControlidModule {
  static registerAsync(options: ControlidAsyncOptions): DynamicModule {
    return {
      module: ControlidModule,
      imports: [
        TypeOrmModule.forFeature([
          ConfigurationEntity,
          AccountEntity,
          EntranceLogEntity,
          BookingEntity,
        ]),
        //TypeOrmModule.forFeature([Users, Cards, Logs], 'controlid'),
        DeskbeeModule,
        DatabaseModule,
      ],
      providers: [
        {
          provide: CONTROLID_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        ControlidService,
        ApiControlid,
        CronService,
      ],
      exports: [ControlidService],
    };
  }
}
