import { Factory } from 'rosie';

import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

import { generateEntityId } from '@common/base/base.entity';

export const GetGameRoomQueryFactory = Factory.define<GetGameRoomQuery>(
  GetGameRoomQuery.name,
  GetGameRoomQuery,
).attrs({
  gameRoomId: () => generateEntityId(),
});
