import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { GetGameRoomQueryFactory } from '@module/game-room/use-cases/get-game-room/__spec__/get-game-room-query.factory';
import { GetGameRoomHandler } from '@module/game-room/use-cases/get-game-room/get-game-room.handler';
import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

import { ClaModuleFactory } from '@common/factories/cls-module.factory';

describe(GetGameRoomHandler.name, () => {
  let handler: GetGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;

  let query: GetGameRoomQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClaModuleFactory(), GameRoomRepositoryModule],
      providers: [GetGameRoomHandler],
    }).compile();

    handler = module.get<GetGameRoomHandler>(GetGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
  });

  beforeEach(() => {
    query = GetGameRoomQueryFactory.build();
  });

  describe('식별자와 일치하는 게임방이 존재하는 경우', () => {
    let gameRoom: GameRoom;

    beforeEach(async () => {
      gameRoom = await gameRoomRepository.insert(
        GameRoomFactory.build({
          id: query.gameRoomId,
        }),
      );
    });

    it('게임방 정보를 반환해야한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(gameRoom);
    });
  });

  describe('식별자와 일치하는 게임방이 존재하지 않는 경우', () => {
    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(query)).rejects.toThrow(
        GameRoomNotFoundError,
      );
    });
  });
});
