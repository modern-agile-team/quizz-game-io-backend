import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';
import { CreateAccountWithUsernameCommand } from '@module/account/use-cases/create-account-with-username/create-account-with-username.command';

export const CreateAccountWithUsernameCommandFactory =
  Factory.define<CreateAccountWithUsernameCommand>(
    CreateAccountWithUsernameCommand.name,
    CreateAccountWithUsernameCommand,
  ).attrs({
    role: () => faker.helpers.arrayElement(Object.values(AccountRole)),
    signInType: () => faker.helpers.arrayElement(Object.values(SignInType)),
    username: () => faker.string.nanoid(20),
    password: () => faker.internet.password(),
  });
