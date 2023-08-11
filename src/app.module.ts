import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { ConfigurationEntity } from './entities/configuration.entity';
import { DeskbeeModule } from './deskbee/deskbee.module';
import GatewayDatabaseModule from './database/gateway-database.module';
import { AccountEntity } from './entities/account.entity';
import { getActiveModule } from './providers/module.provider';
import { ControlidCloudModule } from './modules/controlid-cloud/controlid-cloud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ConfigurationEntity, AccountEntity]),
    DeskbeeModule,
    GatewayDatabaseModule,
    ...getActiveModule(),
    ControlidCloudModule,
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
