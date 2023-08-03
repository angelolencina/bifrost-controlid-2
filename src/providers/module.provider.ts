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
          const integration = await accountRepository
            .find()
            .then(([res]: any) => {
              if (res?.integration) {
                return res?.integration?.find(
                  (row: any) => row?.name === 'controlid-on-premise',
                );
              }
            });
          return {
            activeAccessControl:
              integration.features.includes('access-control'),
            automatedCheckIn:
              integration.features.includes('automated-checkin'),
            genQrCode: integration.features.includes('qr-code'),
          };
        },
      }),
    );
  }
  return modules;
};
