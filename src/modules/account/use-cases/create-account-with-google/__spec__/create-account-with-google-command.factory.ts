import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { AccountRole } from '@module/account/entities/account.entity';
import { CreateAccountWithGoogleCommand } from '@module/account/use-cases/create-account-with-google/create-account-with-google.command';

export const CreateAccountWithGoogleCommandFactory =
  Factory.define<CreateAccountWithGoogleCommand>(
    CreateAccountWithGoogleCommand.name,
    CreateAccountWithGoogleCommand,
  ).attrs({
    role: () => faker.helpers.enumValue(AccountRole),
    socialProviderUid: () => faker.string.nanoid(),
  });
