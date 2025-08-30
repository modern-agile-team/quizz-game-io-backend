import { Factory } from 'rosie';

import { ListGameRoomMembersQuery } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.query';

import { generateEntityId } from '@common/base/base.entity';

export const ListGameRoomMembersQueryFactory =
  Factory.define<ListGameRoomMembersQuery>(
    ListGameRoomMembersQuery.name,
    ListGameRoomMembersQuery,
  ).attrs({
    gameRoomId: () => generateEntityId(),
  });
