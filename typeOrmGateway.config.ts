import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { convertPattern } from './src/utils/convert-name-file-entity-t0-class-name.util';

const loadEntities = async (folderPath: string) => {
  const entities: any[] = [];
  const files = fs.readdirSync(folderPath);
  await Promise.all(
    files.map(async (file) => {
      if (path.extname(file) === '.ts') {
        const entity = await import(path.join(folderPath, file))
          .then((module) => module[convertPattern(file.replace('.ts', ''))])
          .catch((err) => console.error(err));
        entities.push(entity);
      }
    }),
  );
  return entities;
};

const loadMigrations = async (folderPath: string) => {
  const migrations: any[] = [];
  const files = fs.readdirSync(folderPath);
  await Promise.all(
    files.map(async (file) => {
      if (path.extname(file) === '.ts') {
        const migration = await import(path.join(folderPath, file))
          .then(
            (module) =>
              module[file.replace('.ts', '').split('-').reverse().join('')],
          )
          .catch((err) => console.error(err));
        migrations.push(migration);
      }
    }),
  );
  return migrations;
};

const folderPathMigrations = path.join(__dirname, './migrations');
const folderPathGatewayEntities = path.join(__dirname, '/src/entities');
const folderPathIpremiEntities = path.join(
  __dirname,
  '/src/modules/ipremi/entities',
);

const dataSource = async () => {
  const migrations = await loadMigrations(folderPathMigrations);
  const gatewayEntities = await loadEntities(folderPathGatewayEntities);
  const ipremiEntities = await loadEntities(folderPathIpremiEntities);
  return new DataSource({
    type: 'sqlite',
    database: 'gateway.sqlite',
    entities: [...gatewayEntities, ...ipremiEntities],
    migrations: migrations,
  });
};

export default dataSource();
