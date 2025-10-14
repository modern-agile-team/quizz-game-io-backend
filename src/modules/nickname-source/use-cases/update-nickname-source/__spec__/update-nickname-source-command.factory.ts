import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { UpdateNicknameSourceCommand } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.command';

import { generateEntityId } from '@common/base/base.entity';

export const UpdateNicknameSourceCommandFactory =
  Factory.define<UpdateNicknameSourceCommand>(
    UpdateNicknameSourceCommand.name,
    UpdateNicknameSourceCommand,
  ).attrs({
    nicknameSourceId: () => generateEntityId(),
    name: () => faker.string.nanoid(1),
  });
