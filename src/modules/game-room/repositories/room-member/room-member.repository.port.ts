import { GameRoomMember as RoomMemberModel } from '@prisma/client';

import { RoomMember } from '@module/game-room/entities/room-member.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const ROOM_MEMBER_REPOSITORY = Symbol('ROOM_MEMBER_REPOSITORY');

export interface RoomMemberRaw extends RoomMemberModel {}

export interface RoomMemberFilter {}

export interface RoomMemberOrder {}

export interface RoomMemberRepositoryPort
  extends RepositoryPort<RoomMember, RoomMemberFilter, RoomMemberOrder> {
  findByAccountIdInGameRoom(
    accountId: string,
    gameRoomId: string,
  ): Promise<RoomMember | undefined>;
}
