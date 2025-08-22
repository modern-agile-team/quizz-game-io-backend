import { Factory } from 'rosie';

import { ListGameRoomsQuery } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.query';

export const ListGameRoomsQueryFactory = Factory.define<ListGameRoomsQuery>(
  ListGameRoomsQuery.name,
  ListGameRoomsQuery,
).attrs({
  sort: () => [{ field: 'createdAt', direction: 'asc' }],
});
