import { DynamicModule, Module } from '@nestjs/common';
import { IpremiService } from './ipremi.service';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { RewardEntity } from './entities/reward.entity';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { IpremiDto } from './dto/ipremi.dto';
import { IPREMI_CONFIG_OPTIONS } from './constants/ipremi-options.constant';
import IpremiAsyncOptions from './type/ipremi-async-options.type';
import { AccountRepository } from '../../database/repositories/account.repository';
import { AccountEntity } from '../../entities/account.entity';
import { ApiIpremi } from './api/ipremi.api.config';
import { RewardRepository } from './repositories/reward.repository';
import { CronService } from './cron.service';

@Module({})
export class IpremiModule {
  static registerAsync(options: IpremiAsyncOptions): DynamicModule {
    return {
      module: IpremiModule,
      imports: [
        TypeOrmModule.forFeature([BookingEntity, RewardEntity, AccountEntity]),
        DeskbeeModule,
      ],
      providers: [
        {
          provide: IPREMI_CONFIG_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AccountRepository,
        IpremiService,
        RewardRepository,
        ApiIpremi,
        CronService,
      ],
    };
  }
}
