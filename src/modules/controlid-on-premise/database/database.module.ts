import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from '../../../entities/account.entity';
import { Repository } from 'typeorm';
import { IIntegration } from '../../../interface/integration.interface';
import { Users } from '../entities/Users.entity';
import { Usergroups } from '../entities/Usergroups.entity';
import { Usertypes } from '../entities/Usertypes.entity';
import { Typeidentificationrules } from '../entities/Typeidentificationrules.entity';
import { Useridentificationrules } from '../entities/Useridentificationrules.entity';
import { Identificationrules } from '../entities/Identificationrules.entity';
import { Identificationmodes } from '../entities/Identificationmodes.entity';
import { Modeidentificationrules } from '../entities/Modeidentificationrules.entity';
import { Groupidentificationrules } from '../entities/Groupidentificationrules.entity';
import { Groups } from '../entities/Groups.entity';
import { Grouptypes } from '../entities/Grouptypes.entity';
import { Adfields } from '../entities/Adfields.entity';
import { Alarmlogs } from '../entities/Alarmlogs.entity';
import { Cards } from '../entities/Cards.entity';
import { Changelogs } from '../entities/Changelogs.entity';
import { Configfields } from '../entities/Configfields.entity';
import { Configfieldsvalues } from '../entities/Configfieldsvalues.entity';
import { Confignamesvalues } from '../entities/Confignamesvalues.entity';
import { Controlversion } from '../entities/Controlversion.entity';
import { Loginattemptlogs } from '../entities/Loginattemptlogs.entity';
import { Logmessages } from '../entities/Logmessages.entity';
import { Logs } from '../entities/Logs.entity';
import { Devicerelays } from '../entities/Devicerelays.entity';
import { Devices } from '../entities/Devices.entity';
import { Operators } from '../entities/Operators.entity';
import { Operatortypegroups } from '../entities/Operatortypegroups.entity';
import { Operatortypemodules } from '../entities/Operatortypemodules.entity';
import { Operatortypes } from '../entities/Operatortypes.entity';
import { Templates } from '../entities/Templates.entity';

export const getDataBaseConfig = (integration: IIntegration): any => {
  if (integration?.mysql) {
    return {
      name: 'controlid',
      type: 'mysql',
      host: integration.mysql.host,
      port: integration.mysql.port,
      username: integration.mysql.username,
      password: integration.mysql.password,
      database: integration.mysql.database,
      entities: [
        Users,
        Usergroups,
        Usertypes,
        Typeidentificationrules,
        Useridentificationrules,
        Identificationrules,
        Identificationmodes,
        Modeidentificationrules,
        Groupidentificationrules,
        Groups,
        Grouptypes,
        Adfields,
        Alarmlogs,
        Cards,
        Changelogs,
        Configfields,
        Configfieldsvalues,
        Confignamesvalues,
        Controlversion,
        Devicerelays,
        Devices,
        Loginattemptlogs,
        Logmessages,
        Logs,
        Operators,
        Operatortypegroups,
        Operatortypemodules,
        Operatortypes,
        Templates,
      ],
      autoLoadEntities: true,
    };
  }
  const database =
    integration?.sqlite?.path ||
    'C:\\ProgramData\\Control iD\\iDSecure\\acesso.sqlite';
  return {
    name: 'controlid',
    type: 'sqlite',
    database,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
  };
};
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmModule.forFeature([AccountEntity])],
      inject: [getRepositoryToken(AccountEntity)],
      name: 'controlid',
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
        return getDataBaseConfig(integration);
      },
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
