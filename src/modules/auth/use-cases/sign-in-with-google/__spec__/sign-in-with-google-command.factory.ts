import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { SignInWithGoogleCommand } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.command';

export const SignInWithGoogleCommandFactory =
  Factory.define<SignInWithGoogleCommand>(
    SignInWithGoogleCommand.name,
    SignInWithGoogleCommand,
  ).attrs({
    uid: () => faker.string.nanoid(),
  });
