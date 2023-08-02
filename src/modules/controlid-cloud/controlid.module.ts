import { Module } from '@nestjs/common';
import { ControlidService } from './controlid.service';
import { ApiControlid } from './api/controlid.api';
import { BookingEntity } from '../../entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../../entities/entrance-log.entity';
import { DeskbeeModule } from '../../deskbee/deskbee.module';
import ControlidRepository from '../controlid-on-premise/database/repositories/controlid.repository';
import DatabaseModule from '../controlid-on-premise/database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, EntranceLogEntity]),
    DeskbeeModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [ControlidService, ApiControlid, ControlidRepository],
  exports: [ControlidService, ControlidRepository],
})
export class ControlidModule {}
