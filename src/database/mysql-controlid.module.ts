import { Logger, Module } from '@nestjs/common';
import * as mysql from 'mysql2';
import { MYSQL_CONTROLID_CONNECTION } from './db.constants';
import * as dotenv from 'dotenv';
dotenv.config();
const logger = new Logger('DBControlid');
if (!process.env.CONTROLID_MYSQL_HOST) {
  logger.error('CONTROLID_MYSQL_HOST not found');
  process.exit(1);
}
if (!process.env.CONTROLID_MYSQL_USER) {
  logger.error('CONTROLID_MYSQL_USER not found');
  process.exit(1);
}
if (!process.env.CONTROLID_MYSQL_PASSWORD) {
  logger.error('CONTROLID_MYSQL_PASSWORD not found');
  process.exit(1);
}
if (!process.env.CONTROLID_MYSQL_DATABASE) {
  logger.error('CONTROLID_MYSQL_DATABASE not found');
  process.exit(1);
}
const dbProvider = {
  provide: MYSQL_CONTROLID_CONNECTION,
  useValue: mysql.createPool({
    host: process.env.CONTROLID_MYSQL_HOST,
    user: process.env.CONTROLID_MYSQL_USER,
    password: process.env.CONTROLID_MYSQL_PASSWORD,
    database: process.env.CONTROLID_MYSQL_DATABASE,
  }),
};

dbProvider.useValue.getConnection((err, connection) => {
  if (err) {
    logger.error('Error connecting to DBControlid: ', err);
    return;
  }
  logger.verbose('Connected to DBControlid');
});

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class MySqlControlidModule {}
