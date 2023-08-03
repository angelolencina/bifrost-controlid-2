import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../entities/account.entity';
import { ControlidModule } from '../modules/controlid-on-premise/controlid.module';
import { IpremiModule } from '../modules/ipremi/ipremi.module';

export const getActiveModule = () => {
  const modules = [];
  if (process.env.IPREMI === 'true') {
    modules.push(IpremiModule);
  }
  if (process.env.CONTROLID_ON_PREMISE === 'true') {
    modules.push(
      ControlidModule.registerAsync({
        inject: [getRepositoryToken(AccountEntity)],
        useFactory: async (accountRepository: Repository<AccountEntity>) => {
          const config = await accountRepository.find().then(([res]: any) => {
            if (res?.integration) {
              const integration = res?.integration?.find(
                (row: any) => row?.name === 'controlid-on-premise',
              );
              return { settings: res.settings, integration };
            }
          });
          return {
            activeAccessControl:
              config?.integration.features.includes('access-control'),
            mailsToExcludeFromAccessControl:
              config?.integration?.mailsToExcludeFromAccessControl,
            groupsUuidToExcludeFromAccessControl:
              config?.integration?.groupsUuidToExcludeFromAccessControl,
            automatedCheckIn:
              config?.integration.features.includes('automated-checkin'),
            genQrCode: config?.integration.features.includes('qr-code'),
            mailOnHomologation: config?.settings.mailOnHomologation,
            inHomologation: config?.settings.inHomologation,
            activePlaces: config?.settings.activePlaces,
          };
        },
      }),
    );
  }
  return modules;
};
