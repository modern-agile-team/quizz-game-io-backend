import { GameRoomMember as RoomMemberModel } from '@prisma/client';

import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const GAME_ROOM_MEMBER_REPOSITORY = Symbol(
  'GAME_ROOM_MEMBER_REPOSITORY',
);

export interface GameRoomMemberRaw extends RoomMemberModel {}

export interface GameRoomMemberFilter {}

export interface GameRoomMemberOrder {}

export interface GameRoomMemberRepositoryPort
  extends RepositoryPort<
    GameRoomMember,
    GameRoomMemberFilter,
    GameRoomMemberOrder
  > {
  findByAccountIdInGameRoom(
    accountId: string,
    gameRoomId: string,
  ): Promise<GameRoomMember | undefined>;
}
