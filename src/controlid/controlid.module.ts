import { Module } from '@nestjs/common';
import { ControlidService } from './controlid.service';
import { ApiControlid } from '../apis/controlid.api';
import { ApiDeskbee } from '../apis/deskbee.api';
import { BookingEntity } from '../entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../entities/entrance-log.entity';
import { MySqlControlidModule } from '../database/mysql-controlid.module';
import ControlidRepository from '../repositories/controlid.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, EntranceLogEntity]),
    MySqlControlidModule,
  ],
  controllers: [],
  providers: [ControlidService, ApiControlid, ApiDeskbee, ControlidRepository],
  exports: [ControlidService, ControlidRepository],
})
export class ControlidModule {}
