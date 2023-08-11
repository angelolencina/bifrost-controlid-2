import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ControlidCloudOptionsDto } from '../dto/controlid-cloud-options.dto';

type ControlidCloudAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ControlidCloudOptionsDto>, 'useFactory' | 'inject'>;

export default ControlidCloudAsyncOptions;
