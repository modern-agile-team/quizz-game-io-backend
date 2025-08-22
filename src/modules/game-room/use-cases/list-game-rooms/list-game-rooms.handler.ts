import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GameRoom } from '@module/game-room/entities/game-room.entity';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { ListGameRoomsQuery } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.query';

@QueryHandler(ListGameRoomsQuery)
export class ListGameRoomsHandler
  implements IQueryHandler<ListGameRoomsQuery, GameRoom[]>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
  ) {}

  async execute(query: ListGameRoomsQuery): Promise<GameRoom[]> {
    return await this.gameRoomRepository.findAll({ sort: query.sort });
  }
}
