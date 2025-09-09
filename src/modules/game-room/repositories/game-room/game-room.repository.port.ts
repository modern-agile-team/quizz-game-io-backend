import { GameRoom as GameRoomModel } from '@prisma/client';

import { GameRoom } from '@module/game-room/entities/game-room.entity';

import { EntityId } from '@common/base/base.entity';
import { ISort, RepositoryPort } from '@common/base/base.repository';

export const GAME_ROOM_REPOSITORY = Symbol('GAME_ROOM_REPOSITORY');

export interface GameRoomRaw extends GameRoomModel {}

export interface GameRoomFilter {}

export interface GameRoomOrder extends ISort<'createdAt'> {}

export interface GameRoomRepositoryPort
  extends RepositoryPort<GameRoom, GameRoomFilter, GameRoomOrder> {
  findAll(options: { sort?: ISort[] }): Promise<GameRoom[]>;
  incrementCurrentMembersCount(gameRoomId: EntityId): Promise<number>;
  decrementCurrentMembersCount(gameRoomId: EntityId): Promise<number>;
}
