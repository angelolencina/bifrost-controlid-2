import { Module } from '@nestjs/common';
import { IpremiService } from './ipremi.service';
import { DeskbeeModule } from '../deskbee/deskbee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from '../entities/booking.entity';

@Module({
  imports: [DeskbeeModule, TypeOrmModule.forFeature([BookingEntity])],
  controllers: [],
  providers: [IpremiService],
})
export class IpremiModule {}
