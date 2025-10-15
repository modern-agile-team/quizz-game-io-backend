import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Account,
  AccountProps,
  AccountRole,
  SignInType,
  SocialProvider,
} from '@module/account/entities/account.entity';

import { generateEntityId } from '@common/base/base.entity';

export const AccountFactory = Factory.define<Account & AccountProps>(
  Account.name,
)
  .attrs({
    id: () => generateEntityId(),
    role: () => faker.helpers.arrayElement(Object.values(AccountRole)),
    signInType: () => faker.helpers.arrayElement(Object.values(SignInType)),
    socialProvider: () => faker.helpers.enumValue(SocialProvider),
    socialProviderUid: () => faker.string.nanoid(),
    username: () => generateEntityId(),
    password: () => faker.internet.password(),
    nickname: () => generateEntityId(),
    enteredAt: () => faker.date.past(),
    leftAt: () => faker.date.future(),
    isActive: () => faker.datatype.boolean(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Account({ id, createdAt, updatedAt, props }),
  );
