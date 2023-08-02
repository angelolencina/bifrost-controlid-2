import { DynamicModule, Module } from '@nestjs/common';
import { ControlidService } from './controlid.service';
import { ApiControlid } from './api/controlid.api';
import { BookingEntity } from '../../entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { MySqlControlidModule } from './database/mysql.module';
import ControlidRepository from '../../repositories/controlid.repository';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { CronService } from './cron.service';
import { AccountEntity } from '../../entities/account.entity';
import { CONTROLID_CONFIG_OPTIONS } from './constants/controlid-options.constant';
import ControlidOptions from './interface/controlid-options.interface';
import ControlidAsyncOptions from './types/controlid-async-options.type';
import { ConfigurationEntity } from '../../entities/configuration.entity';

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
        DeskbeeModule,
      ],
      providers: [
        {
          provide: CONTROLID_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        ControlidService,
        ApiControlid,
        ControlidRepository,
        CronService,
      ],
      exports: [ControlidService],
    };
  }
}
