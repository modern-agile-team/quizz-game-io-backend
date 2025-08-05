import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  Account,
  AccountProps,
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';

import { generateEntityId } from '@common/base/base.entity';

export const AccountFactory = Factory.define<Account & AccountProps>(
  Account.name,
)
  .attrs({
    id: () => generateEntityId(),
    role: () => faker.helpers.arrayElement(Object.values(AccountRole)),
    signInType: () => faker.helpers.arrayElement(Object.values(SignInType)),
    username: () => faker.internet.username(),
    password: () => faker.internet.password(),
    enteredAt: () => faker.date.past(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new Account({ id, createdAt, updatedAt, props }),
  );
