import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

@QueryHandler(GetGameRoomQuery)
export class GetGameRoomHandler
  implements IQueryHandler<GetGameRoomQuery, GameRoom>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
  ) {}

  async execute(query: GetGameRoomQuery): Promise<GameRoom> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      query.gameRoomId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    return gameRoom;
  }
}
