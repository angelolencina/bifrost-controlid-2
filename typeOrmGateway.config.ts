import { DataSource } from 'typeorm';
import { Init1690859643216 } from './migrations/1690859643216-Init';
export default new DataSource({
  type: 'sqlite',
  database: 'gateway.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [Init1690859643216],
});
