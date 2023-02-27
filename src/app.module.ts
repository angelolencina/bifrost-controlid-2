import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MySqlControlidModule } from './database/mysql-controlid.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ControlidPlugin } from './plugins/controlid.plugin';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ApiDeskbee } from './apis/deskbee.api';
import ControlidRepository from './repositories/controlid.repository';
import { ApiControlid } from './apis/controlid.api';
import { BookingEntity } from './entities/booking.entity';
import { EntranceLogEntity } from './entities/entrance-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'bifrostdatabase.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([BookingEntity, EntranceLogEntity]),
    MySqlControlidModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiDeskbee,
    ControlidPlugin,
    ControlidRepository,
    ApiControlid,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
