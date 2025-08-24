import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateAccountCommandFactory = Factory.define<CreateAccountCommand>(
  CreateAccountCommand.name,
  CreateAccountCommand,
).attrs({
  role: () => faker.helpers.arrayElement(Object.values(AccountRole)),
  signInType: () => faker.helpers.arrayElement(Object.values(SignInType)),
  username: () => faker.string.nanoid(20),
  password: () => faker.internet.password(),
  nickname: () => generateEntityId(),
});
