import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import ControlidOptions from '../interface/controlid-options.interface';

type ControlidAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ControlidOptions>, 'useFactory' | 'inject'>;

export default ControlidAsyncOptions;
