import { MikroORM } from '@mikro-orm/core';
import { MetadataStorage } from '@mikro-orm/postgresql';
import mikroOrmConfig from 'mikro-orm.config';

export const mikroOrmFactory = async () => {
  const ormConfig = mikroOrmConfig;
  ormConfig.clientUrl = process.env.DATABASE_URL;

  const orm = await MikroORM.init(mikroOrmConfig);

  // --test-file 옵션으로 테스트 파일을 실행할 때 에러가 발생하여 해당 코드를 추가하여 해결함
  // 발생 원인은 아직 파악하지 못함
  // Reference: https://github.com/mikro-orm/mikro-orm/discussions/3795#discussioncomment-7920535
  MetadataStorage.clear();

  return orm;
};
