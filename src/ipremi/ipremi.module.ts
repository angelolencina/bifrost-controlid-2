import { Module } from '@nestjs/common';
import { IpremiService } from './ipremi.service';
import { DeskbeeModule } from '../deskbee/deskbee.module';

@Module({
  imports: [DeskbeeModule],
  controllers: [],
  providers: [IpremiService],
})
export class IpremiModule {}
