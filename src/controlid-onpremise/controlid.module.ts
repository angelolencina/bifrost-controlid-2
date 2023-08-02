import { Module } from '@nestjs/common';
import { BookingEntity } from '../entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceLogEntity } from '../entities/entrance-log.entity';
import { MySqlControlidModule } from '../controlid-on-premise/database/mysql.module';
import ControlidRepository from '../repositories/controlid.repository';
import { DeskbeeModule } from '../deskbee/deskbee.module';
import { ApiControlid } from '../controlid-on-premise/api/controlid.api';
import { ControlidService } from '../controlid-on-premise/controlid.service';

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
