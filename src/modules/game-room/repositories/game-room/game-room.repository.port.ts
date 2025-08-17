import { GameRoom as GameRoomModel } from '@prisma/client';

import { GameRoom } from '@module/game-room/entities/game-room.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const GAME_ROOM_REPOSITORY = Symbol('GAME_ROOM_REPOSITORY');

export interface GameRoomRaw extends GameRoomModel {}

export interface GameRoomFilter {}

export interface GameRoomOrder {}

export interface GameRoomRepositoryPort
  extends RepositoryPort<GameRoom, GameRoomFilter, GameRoomOrder> {}
