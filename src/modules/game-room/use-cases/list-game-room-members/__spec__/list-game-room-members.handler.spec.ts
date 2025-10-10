import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomMemberFactory } from '@module/game-room/entities/__spec__/game-room-member.factory';
import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { ListGameRoomMembersQueryFactory } from '@module/game-room/use-cases/list-game-room-members/__spec__/list-game-room-members-query.factory';
import { ListGameRoomMembersHandler } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.handler';
import { ListGameRoomMembersQuery } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.query';

import { ClaModuleFactory } from '@common/factories/cls-module.factory';

describe(ListGameRoomMembersHandler.name, () => {
  let handler: ListGameRoomMembersHandler;

  let gameRoomRepository: GameRoomRepositoryPort;

  let query: ListGameRoomMembersQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClaModuleFactory(), GameRoomRepositoryModule],
      providers: [ListGameRoomMembersHandler],
    }).compile();

    handler = module.get<ListGameRoomMembersHandler>(
      ListGameRoomMembersHandler,
    );

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
  });

  beforeEach(() => {
    query = ListGameRoomMembersQueryFactory.build();
  });

  describe('게임방 목록을 조회하면', () => {
    let gameRoomMembers: GameRoomMember[];

    beforeEach(async () => {
      gameRoomMembers = GameRoomMemberFactory.buildList(3, {});
      await gameRoomRepository.insert(
        GameRoomFactory.build({
          id: query.gameRoomId,
          members: gameRoomMembers,
        }),
      );
    });

    it('게임방의 모든 구성원을 조회해야한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(
        expect.arrayContaining(gameRoomMembers),
      );
    });
  });

  describe('게임방이 존재하지 않는 경우', () => {
    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(query)).rejects.toThrow(
        GameRoomNotFoundError,
      );
    });
  });
});
