import { Module } from '@nestjs/common';
import { DeskbeeService } from './deskbee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationEntity } from '../entities/configuration.entity';
import { AccountEntity } from '../entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigurationEntity, AccountEntity])],
  providers: [DeskbeeService],
  exports: [DeskbeeService],
})
export class DeskbeeModule {}
