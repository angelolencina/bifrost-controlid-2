import { Module } from '@nestjs/common';
import { IpremiService } from './ipremi.service';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { RewardEntity } from './entities/reward.entity';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DeskbeeModule,
    TypeOrmModule.forFeature([BookingEntity, RewardEntity]),
  ],
  controllers: [],
  providers: [IpremiService],
})
export class IpremiModule {}
