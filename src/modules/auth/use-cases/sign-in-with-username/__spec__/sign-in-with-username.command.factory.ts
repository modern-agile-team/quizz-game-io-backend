import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { SignInWithUsernameCommand } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.command';

export const SignInWithUsernameCommandFactory =
  Factory.define<SignInWithUsernameCommand>(
    SignInWithUsernameCommand.name,
  ).attrs({
    username: () => faker.string.nanoid(10),
    password: () => faker.string.uuid(),
  });
