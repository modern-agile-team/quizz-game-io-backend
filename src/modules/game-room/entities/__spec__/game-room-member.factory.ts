import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  GameRoomMember,
  GameRoomMemberProps,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';

import { generateEntityId } from '@common/base/base.entity';

export const GameRoomMemberFactory = Factory.define<
  GameRoomMember & GameRoomMemberProps
>(GameRoomMember.name)
  .attrs({
    id: () => generateEntityId(),
    accountId: () => generateEntityId(),
    role: () => faker.helpers.enumValue(GameRoomMemberRole),
    nickname: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new GameRoomMember({ id, createdAt, updatedAt, props }),
  );
