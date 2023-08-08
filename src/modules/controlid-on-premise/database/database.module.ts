import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { AccountEntity } from '../../../entities/account.entity';
import { Not, Repository } from 'typeorm';
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

const CONTROLID_ENTITIES = [
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
];

export const getDataBaseConfig = (databases: any): any => {
  if (databases?.mysql) {
    return {
      name: 'controlid',
      type: 'mysql',
      host: databases.mysql.host,
      port: databases.mysql.port,
      username: databases.mysql.username,
      password: databases.mysql.password,
      database: databases.mysql.database,
      entities: CONTROLID_ENTITIES,
      autoLoadEntities: true,
    };
  }
  const database = databases?.sqlite?.path || 'acesso.sqlite';
  return {
    name: 'controlid',
    type: 'sqlite',
    database,
    entities: CONTROLID_ENTITIES,
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
        const config = await accountRepository.findOne({
          where: { code: Not('null') },
        });
        return getDataBaseConfig(
          config?.integration?.controlidOnPremise?.database,
        );
      },
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
