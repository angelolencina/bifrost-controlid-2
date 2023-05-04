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
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        DESKBEE_API_URL: Joi.string().required(),
        DESKBEE_API_CLIENT_ID: Joi.string().required(),
        DESKBEE_API_CLIENT_SECRET: Joi.string().required(),
        DESKBEE_API_SCOPE: Joi.string().required(),
        CONTROLID_DB_CONNECTION: Joi.string().required().default('mysql'),
        CONTROLID_SQLITE_DB_PATH: Joi.alternatives().conditional(
          'CONTROLID_DB_CONNECTION',
          {
            is: 'sqlite',
            then: Joi.string()
              .required()
              .default('C:\\ProgramData\\Control iD\\iDSecure\\acesso.sqlite'),
          },
        ),
        CONTROLID_MYSQL_HOST: Joi.alternatives().conditional(
          'CONTROLID_DB_CONNECTION',
          {
            is: 'mysql',
            then: Joi.string().required().default('localhost'),
          },
        ),
        CONTROLID_MYSQL_PORT: Joi.alternatives().conditional(
          'CONTROLID_DB_CONNECTION',
          {
            is: 'mysql',
            then: Joi.number().required().default(3306),
          },
        ),
        CONTROLID_MYSQL_USER: Joi.alternatives().conditional(
          'CONTROLID_DB_CONNECTION',
          {
            is: 'mysql',
            then: Joi.string().required().default('root'),
          },
        ),
        CONTROLID_MYSQL_PASSWORD: Joi.alternatives().conditional(
          'CONTROLID_DB_CONNECTION',
          {
            is: 'mysql',
            then: Joi.string().required(),
          },
        ),
        CONTROLID_MYSQL_DATABASE: Joi.alternatives().conditional(
          'CONTROLID_DB_CONNECTION',
          {
            is: 'mysql',
            then: Joi.string().required().default('acesso'),
          },
        ),
      }),

      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'bifrostdatabase.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ConfigurationEntity]),
    ControlidModule,
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
