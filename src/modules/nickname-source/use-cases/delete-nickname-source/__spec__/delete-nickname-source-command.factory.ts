import { Factory } from 'rosie';

import { DeleteNicknameSourceCommand } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.command';

import { generateEntityId } from '@common/base/base.entity';

export const DeleteNicknameSourceCommandFactory =
  Factory.define<DeleteNicknameSourceCommand>(
    DeleteNicknameSourceCommand.name,
    DeleteNicknameSourceCommand,
  ).attrs({
    nicknameSourceId: () => generateEntityId(),
  });
