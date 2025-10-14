import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  NicknameSource,
  NicknameSourceProps,
} from '@module/nickname-source/entities/nickname-source.entity';

import { generateEntityId } from '@common/base/base.entity';

export const NicknameSourceFactory = Factory.define<
  NicknameSource & NicknameSourceProps
>(NicknameSource.name)
  .attrs({
    id: () => generateEntityId(),
    name: () => faker.string.nanoid(5),
    sequence: () => 1,
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new NicknameSource({ id, createdAt, updatedAt, props }),
  );
