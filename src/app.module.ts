import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { ConfigurationEntity } from './entities/configuration.entity';
import { DeskbeeModule } from './deskbee/deskbee.module';
import GatewayDatabaseModule from './database/gateway-database.module';
import { AccountEntity } from './entities/account.entity';
import { ControlidCloudModule } from './modules/controlid-cloud/controlid-cloud.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { AccountRepository } from './database/repositories/account.repository';
import { getActiveModules } from './providers/module.provider';
const logger = new Logger('AppModuleInit');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ...getActiveModules(),
    TypeOrmModule.forFeature([ConfigurationEntity, AccountEntity]),
    DeskbeeModule,
    GatewayDatabaseModule,
    ControlidCloudModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AccountRepository,
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
