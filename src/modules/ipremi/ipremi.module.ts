import { DynamicModule, Module } from '@nestjs/common';
import { IpremiService } from './ipremi.service';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { RewardEntity } from './entities/reward.entity';
import { IPREMI_CONFIG_OPTIONS } from './constants/ipremi-options.constant';
import IpremiAsyncOptions from './type/ipremi-async-options.type';
import { AccountRepository } from '../../database/repositories/account.repository';
import { AccountEntity } from '../../entities/account.entity';
import { ApiIpremi } from './api/ipremi.api.config';
import { RewardRepository } from './repositories/reward.repository';
import { CronService } from './cron.service';
import { IpremiController } from './ipremi.controller';
import { IpremiUserEntity } from './entities/ipremi-user.entity';

@Module({})
export class IpremiModule {
  static registerAsync(options: IpremiAsyncOptions): DynamicModule {
    return {
      module: IpremiModule,
      imports: [
        TypeOrmModule.forFeature([
          BookingEntity,
          RewardEntity,
          AccountEntity,
          IpremiUserEntity,
        ]),
        DeskbeeModule,
      ],
      controllers: [IpremiController],
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
