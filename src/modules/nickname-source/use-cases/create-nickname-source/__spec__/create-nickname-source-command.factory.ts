import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateNicknameSourceCommand } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.command';

export const CreateNicknameSourceCommandFactory =
  Factory.define<CreateNicknameSourceCommand>(
    CreateNicknameSourceCommand.name,
    CreateNicknameSourceCommand,
  ).attrs({
    name: () => faker.string.nanoid(1),
  });
