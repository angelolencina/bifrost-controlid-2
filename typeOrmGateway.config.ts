import { DataSource } from 'typeorm';
import { Init1690826187218 } from './migrations/1690826187218-Init';

export default new DataSource({
  type: 'sqlite',
  database: 'gateway.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [Init1690826187218],
});
