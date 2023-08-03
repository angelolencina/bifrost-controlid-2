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
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        IPREMI_CAMPAIGN_ID: Joi.string().required(),
        IPREMI_PARTNER_ACCESS_KEY: Joi.string().required(),
        IPREMI_LOGIN: Joi.string().required(),
        IPREMI_PASSWORD: Joi.string().required(),
        IPREMI_PROFILE_ID: Joi.string().required(),
        IPREMI_ENTERPRISE_ID: Joi.string().required(),
        IPREMI_BANK_ACCOUNT_ID: Joi.string().required(),
        IPREMI_TOKEN_API: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'local', 'homologation')
          .default('local'),
      }),
    }),
    DeskbeeModule,
    TypeOrmModule.forFeature([BookingEntity, RewardEntity]),
  ],
  controllers: [],
  providers: [IpremiService],
})
export class IpremiModule {}
