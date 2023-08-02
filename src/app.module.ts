import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ControlidModule } from './modules/controlid-on-premise/controlid.module';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ConfigurationEntity } from './entities/configuration.entity';
import { DeskbeeModule } from './deskbee/deskbee.module';
import { IpremiModule } from './ipremi/ipremi.module';
import DatabaseModule from './database/database.module';
import { AccountEntity } from './entities/account.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ConfigurationEntity, AccountEntity]),
    DeskbeeModule,
    IpremiModule,
    DatabaseModule,
    ControlidModule.registerAsync({
      inject: [getRepositoryToken(AccountEntity)],
      useFactory: async (accountRepository: Repository<AccountEntity>) => {
        const integration = await accountRepository
          .find()
          .then(([res]: any) => {
            if (res?.integration) {
              return res?.integration?.find(
                (row: any) => row?.name === 'controlid-on-premise',
              );
            }
          });
        return {
          activeAccessControl: integration.features.includes('access-control'),
          automatedCheckIn: integration.features.includes('automated-checkin'),
          genQrCode: integration.features.includes('qr-code'),
        };
      },
    }),
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
