/* eslint-disable */
import { mikroOrmFactory } from '../test/mikro-orm.factory';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
// eslint-disable-next-line prettier/prettier
import dotenv from 'dotenv';

module.exports = async function () {
  dotenv.config({ path: '../.env.test' });

  const container = await new PostgreSqlContainer('postgres:16.1').start();

  process.env.DATABASE_URL = container.getConnectionUri();

  const orm = await mikroOrmFactory();

  await orm.schema.refreshDatabase();

  await orm.close(true);

  globalThis.__POSTGRES_CONTAINER__ = container;
};
