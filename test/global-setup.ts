import { PostgreSqlContainer } from '@testcontainers/postgresql';
import dotenv from 'dotenv';
import { mikroOrmFactory } from 'test/mikro-orm.factory';

module.exports = async function () {
  dotenv.config({ path: 'apps/service-courseware/.env.test' });

  const container = await new PostgreSqlContainer('postgres:16.1').start();

  process.env.DATABASE_URL = container.getConnectionUri();

  const orm = await mikroOrmFactory();

  await orm.schema.refreshDatabase();

  await orm.close(true);

  globalThis.__POSTGRES_CONTAINER__ = container;
};
