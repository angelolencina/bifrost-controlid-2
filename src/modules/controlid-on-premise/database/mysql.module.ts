import { Logger, Module } from '@nestjs/common';
import * as mysql from 'mysql2';
import { MYSQL_CONTROLID_CONNECTION } from './db.constants';
import { config } from 'dotenv';

config();

const logger = new Logger('DBControlid');
const dbProvider = {
  provide: MYSQL_CONTROLID_CONNECTION,
  useValue: mysql.createPool({
    host: process.env.CONTROLID_MYSQL_HOST,
    user: process.env.CONTROLID_MYSQL_USER,
    password: process.env.CONTROLID_MYSQL_PASSWORD,
    database: process.env.CONTROLID_MYSQL_DATABASE,
    port: Number(process.env.CONTROLID_MYSQL_PORT),
  }),
};

dbProvider.useValue.getConnection((err, connection) => {
  if (err) {
    logger.verbose('Error when connect to DBControlid');
    return;
  }
  logger.log('Connected to DBControlid');
});

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
  imports: [],
})
export class MySqlControlidOnPremiseModule {}
