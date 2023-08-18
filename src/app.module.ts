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
import { DynamicCustomModule } from './dynamic-custom.module';
import { Not } from 'typeorm';
import { AccountRepository } from './database/repositories/account.repository';
import { ControlidOnPremiseModule } from './modules/controlid-on-premise/controlid.module';
import { IpremiModule } from './modules/ipremi/ipremi.module';
const logger = new Logger('AppModule');
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
    DynamicCustomModule.registerAsync({
      inject: [AccountRepository],
      useFactory: async (accountRepo: AccountRepository) => {
        const modules = [];
        const config: any = await accountRepo.findOne({
          where: { integration: Not('null') },
        });
        if (config?.integration.iPremi) {
          modules.push(IpremiModule);
        }
        if (config?.integration.controlidOnPremise) {
          modules.push(ControlidOnPremiseModule);
        }
        if (config?.integration.controlidCloud) {
          modules.push(ControlidCloudModule);
        }
        if (config?.integration.easy5) {
          throw new Error('Easy5 not implemented');
        }
        if (config?.integration.waccess) {
          throw new Error('Waccess not implemented');
        }
        if (config?.integration.omni) {
          throw new Error('Omni not implemented');
        }
        logger.verbose(
          `Active modules: ${
            modules.length
              ? modules.map((m) => m.name).join(', ')
              : 'NONE CONFIGURATION'
          }`,
        );
        return modules;
      },
    }),
    ControlidCloudModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
