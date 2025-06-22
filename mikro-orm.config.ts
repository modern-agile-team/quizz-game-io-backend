import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { Entity, PostgreSqlDriver, PrimaryKey } from '@mikro-orm/postgresql';
import dotenv from 'dotenv';

@Entity({ tableName: 'temp' })
export class TempEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;
}

const ENTITIES = [TempEntity];

const migrations = {
  tableName: 'mikro_orm_migrations', // migrations table name
  path: './db/migrations', // path to folder with migration files
  glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
  transactional: true, // run each migration inside transaction
  disableForeignKeys: false, // try to disable foreign_key_checks (or equivalent)
  allOrNothing: true, // run all migrations in current batch in master transaction
  emit: 'ts', // migration generation mode
  dropTables: true,
  snapshot: true,
  fileName: (timestamp, name) => `${timestamp}_${name}`,
};

dotenv.config();

const configs = {
  test: {
    entities: ENTITIES,
    clientUrl: process.env.DATABASE_URL,
    schema: 'quizzes_game_io_backend',
    driver: PostgreSqlDriver,
    allowGlobalContext: true,
    extensions: [],
  } as Options,
  local: {
    entities: ENTITIES,
    clientUrl: process.env.DATABASE_URL,
    schema: 'quizzes_game_io_backend',
    driver: PostgreSqlDriver,
    debug: true,
    pool: { min: 1, max: 2 },
    schemaGenerator: {
      createForeignKeyConstraints: true,
    },
    allowGlobalContext: true,
    migrations,
    extensions: [Migrator],
  } as Options,
  dev: {
    entities: ENTITIES,
    clientUrl: process.env.DATABASE_URL,
    schema: 'quizzes_game_io_backend',
    driver: PostgreSqlDriver,
    debug: true,
    pool: { min: 1, max: 2 },
    schemaGenerator: {
      createForeignKeyConstraints: true,
    },
    migrations,
    extensions: [Migrator],
  } as Options,
  stag: {
    entities: ENTITIES,
    clientUrl: process.env.DATABASE_URL,
    schema: 'quizzes_game_io_backend',
    driver: PostgreSqlDriver,
    debug: false,
    pool: { min: 1, max: 2 },
    schemaGenerator: {
      createForeignKeyConstraints: true,
    },
    migrations,
    extensions: [Migrator],
  } as Options,
  prod: {
    entities: ENTITIES,
    clientUrl: process.env.DATABASE_URL,
    schema: 'quizzes_game_io_backend',
    driver: PostgreSqlDriver,
    debug: false,
    pool: { min: 1, max: 2 },
    schemaGenerator: {
      createForeignKeyConstraints: true,
    },
    migrations,
    extensions: [Migrator],
  } as Options,
};

export default configs[process.env.APP_STAGE || 'local'];
