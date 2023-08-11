import { Not } from 'typeorm';
import { ControlidModule } from '../modules/controlid-on-premise/controlid.module';
import { IpremiModule } from '../modules/ipremi/ipremi.module';
import { AccountRepository } from '../database/repositories/account.repository';
import { IpremiDto } from '../modules/ipremi/dto/ipremi.dto';
import { ControlidOnPremiseDto } from '../modules/controlid-on-premise/dto/controlid-on-premise-request.dto';

export const getActiveModule = () => {
  const modules = [];
  modules.push(
    IpremiModule.registerAsync({
      inject: [AccountRepository],
      useFactory: async (accountRepo: AccountRepository) => {
        const config = await accountRepo.findOne({
          where: { integration: Not('null') },
        });
        if (config?.integration?.iPremi) {
          return config.integration.iPremi;
        }

        return new IpremiDto();
      },
    }),
  );

  modules.push(
    ControlidModule.registerAsync({
      inject: [AccountRepository],
      useFactory: async (accountRepo: AccountRepository) => {
        const config = await accountRepo.findOne({
          where: { integration: Not('null') },
        });
        if (config?.integration?.controlidOnPremise) {
          return config.integration.controlidOnPremise;
        }

        return new ControlidOnPremiseDto();
      },
    }),
  );

  return modules;
};
