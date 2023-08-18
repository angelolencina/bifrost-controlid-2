import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { IpremiDto } from '../modules/ipremi/dto/ipremi.dto';
import { DynamicDto } from '../dto/dynamic.dto';
import { AccountRepository } from '../database/repositories/account.repository';

type DynamicAsyncOptions = {
  inject?: any[];
  useFactory: (accountRepo: AccountRepository) => Promise<any[]>;
};
export default DynamicAsyncOptions;
