import { Module, DynamicModule, Global } from '@nestjs/common';
import DynamicAsyncOptions from './type/dynamic-async-options.type';
import { AccountRepository } from './database/repositories/account.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';

@Global()
@Module({})
export class DynamicCustomModule {
  static registerAsync(options: DynamicAsyncOptions): DynamicModule {
    return {
      module: DynamicCustomModule,
      imports: [TypeOrmModule.forFeature([AccountEntity])],
      providers: [
        {
          provide: 'DYNAMIC_MODULES',
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AccountRepository,
      ],
      exports: ['DYNAMIC_MODULES'],
    };
  }
}
