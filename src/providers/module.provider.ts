import { Not } from 'typeorm';
import { ControlidOnPremiseModule } from '../modules/controlid-on-premise/controlid.module';
import { IpremiModule } from '../modules/ipremi/ipremi.module';
import { AccountRepository } from '../database/repositories/account.repository';
import { IpremiDto } from '../modules/ipremi/dto/ipremi.dto';
import { ControlidOnPremiseDto } from '../modules/controlid-on-premise/dto/controlid-on-premise-request.dto';

const fetchIntegrationConfig = async (
  accountRepo: AccountRepository,
  key: string,
  defaultDto: any,
) => {
  const config: any = await accountRepo.findOne({
    where: { integration: Not('null') },
  });
  return config?.integration?.[key] || defaultDto;
};

export const getActiveModules = () => {
  return [
    IpremiModule.registerAsync({
      inject: [AccountRepository],
      useFactory: async (accountRepo: AccountRepository) =>
        fetchIntegrationConfig(accountRepo, 'iPremi', new IpremiDto()),
    }),
    ControlidOnPremiseModule.registerAsync({
      inject: [AccountRepository],
      useFactory: async (accountRepo: AccountRepository) =>
        fetchIntegrationConfig(
          accountRepo,
          'controlidOnPremise',
          new ControlidOnPremiseDto(),
        ),
    }),
  ];
};
