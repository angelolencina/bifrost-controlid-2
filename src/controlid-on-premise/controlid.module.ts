import { Module } from '@nestjs/common';
import { ControlidService } from './controlid.service';
import { ApiControlid } from './api/controlid.api';
import { BookingEntity } from '../entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../entities/entrance-log.entity';
import { MySqlControlidModule } from '../database/mysql-controlid.module';
import ControlidRepository from '../repositories/controlid.repository';
import { DeskbeeModule } from '../deskbee/deskbee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, EntranceLogEntity]),
    MySqlControlidModule,
    DeskbeeModule,
  ],
  controllers: [],
  providers: [ControlidService, ApiControlid, ControlidRepository],
  exports: [ControlidService, ControlidRepository],
})
export class ControlidModule {}
