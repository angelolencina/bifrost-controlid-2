import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ControlidModule } from './controlid/controlid.module';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ConfigurationEntity } from './entities/configuration.entity';
import { DeskbeeModule } from './deskbee/deskbee.module';
import { IpremiModule } from './ipremi/ipremi.module';
import DatabaseModule from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ConfigurationEntity]),
    DeskbeeModule,
    IpremiModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [TypeOrmModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
