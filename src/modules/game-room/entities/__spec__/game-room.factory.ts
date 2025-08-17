import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  GameRoom,
  GameRoomProps,
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

import { generateEntityId } from '@common/base/base.entity';

export const GameRoomFactory = Factory.define<GameRoom & GameRoomProps>(
  GameRoom.name,
)
  .attrs({
    id: () => generateEntityId(),
    status: () => faker.helpers.enumValue(GameRoomStatus),
    visibility: () => faker.helpers.enumValue(GameRoomVisibility),
    title: () => faker.string.nanoid(),
    maxPlayersCount: () => faker.number.int({ min: 2, max: 10 }),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new GameRoom({ id, createdAt, updatedAt, props }),
  );
