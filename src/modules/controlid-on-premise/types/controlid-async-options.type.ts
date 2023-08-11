import { ModuleMetadata } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import { ControlidOnPremiseDto } from '../dto/controlid-on-premise-request.dto';

type ControlidAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ControlidOnPremiseDto>, 'useFactory' | 'inject'>;

export default ControlidAsyncOptions;
