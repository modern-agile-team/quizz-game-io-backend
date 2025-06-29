import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { SignInType } from '@module/account/entities/account.entity';
import { SignUpWithUsernameCommand } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.command';

export const SignUpWithUsernameCommandFactory =
  Factory.define<SignUpWithUsernameCommand>(
    SignUpWithUsernameCommand.name,
  ).attrs({
    username: () => faker.string.nanoid(10),
    password: () => faker.string.uuid(),
    signInType: SignInType.username,
  });
