import { DataSource } from 'typeorm';
import { Init1690859643216 } from './migrations/1690859643216-Init';
import { AddAccount1690905299829 } from './migrations/1690905299829-AddAccount';
import { AddPersonalBadges1691116497215 } from './migrations/1691116497215-AddPersonalBadges';
export default new DataSource({
  type: 'sqlite',
  database: 'gateway.sqlite',
  entities: [__dirname + '/src/entities/*.entity{.ts,.js}'],
  migrations: [
    Init1690859643216,
    AddAccount1690905299829,
    AddPersonalBadges1691116497215,
  ],
});
