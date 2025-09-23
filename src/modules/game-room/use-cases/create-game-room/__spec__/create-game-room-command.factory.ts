import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import { CreateGameRoomCommand } from '@module/game-room/use-cases/create-game-room/create-game-room.command';

import { generateEntityId } from '@common/base/base.entity';

export const CreateGameRoomCommandFactory =
  Factory.define<CreateGameRoomCommand>(
    CreateGameRoomCommand.name,
    CreateGameRoomCommand,
  ).attrs({
    currentAccountId: () => generateEntityId(),
    title: () => faker.string.nanoid(),
    quizzesCount: () => faker.number.int({ min: 1, max: 10 }),
  });
