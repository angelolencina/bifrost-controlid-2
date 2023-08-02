import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import MySqlOptions from '../interface/mysql-options.interface';

type MySqlAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<MySqlOptions>, 'useFactory' | 'inject'>;

export default MySqlAsyncOptions;
