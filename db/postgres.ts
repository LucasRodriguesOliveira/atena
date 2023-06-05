import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { migrations } from './migrations';

const result = config({
  path: `${process.cwd()}\\.env.test`,
});

console.log(result);

const {
  DATABASE_HOST: host,
  DATABASE_USER: user,
  DATABASE_PASSWORD: pass,
  DATABASE_PORT: port,
  DATABASE_NAME: name,
} = process.env;

export const PostgresMigration = new DataSource({
  type: 'postgres',
  host,
  port: parseInt(port, 10) || 5432,
  username: user,
  password: pass,
  database: name,
  migrations,
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});
