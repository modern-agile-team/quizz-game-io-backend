import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomMemberRepository } from '@module/game-room/repositories/game-room-member/game-room-member.repository';
import { GAME_ROOM_MEMBER_REPOSITORY } from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';
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
    @Inject(GAME_ROOM_MEMBER_REPOSITORY)
    private readonly gameRoomMemberRepository: GameRoomMemberRepository,
  ) {}

  async execute(query: ListGameRoomMembersQuery): Promise<unknown> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      query.gameRoomId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError();
    }

    const gameRoomMembers =
      await this.gameRoomMemberRepository.findByGameRoomId(query.gameRoomId);

    return gameRoomMembers;
  }
}
