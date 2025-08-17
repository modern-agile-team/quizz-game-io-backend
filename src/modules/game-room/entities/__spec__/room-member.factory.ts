import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  RoomMember,
  RoomMemberProps,
  RoomMemberRole,
} from '@module/game-room/entities/room-member.entity';

import { generateEntityId } from '@common/base/base.entity';

export const RoomMemberFactory = Factory.define<RoomMember & RoomMemberProps>(
  RoomMember.name,
)
  .attrs({
    id: () => generateEntityId(),
    accountId: () => generateEntityId(),
    gameRoomId: () => generateEntityId(),
    role: () => faker.helpers.enumValue(RoomMemberRole),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new RoomMember({ id, createdAt, updatedAt, props }),
  );
