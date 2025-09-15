import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { ListGameRoomMembersQuery } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.query';

@QueryHandler(ListGameRoomMembersQuery)
export class ListGameRoomMembersHandler
  implements IQueryHandler<ListGameRoomMembersQuery, unknown>
{
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
  ) {}

  async execute(query: ListGameRoomMembersQuery): Promise<unknown> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      query.gameRoomId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    return gameRoom.members;
  }
}
