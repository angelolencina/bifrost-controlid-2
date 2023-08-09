import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { IpremiDto } from '../../../dto/ipremi.dto';

type IpremiAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<IpremiDto>, 'useFactory' | 'inject'>;

export default IpremiAsyncOptions;
