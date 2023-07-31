import { Module } from '@nestjs/common';
import { DeskbeeService } from './deskbee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationEntity } from '../entities/configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigurationEntity])],
  providers: [DeskbeeService],
  exports: [DeskbeeService],
})
export class DeskbeeModule {}
