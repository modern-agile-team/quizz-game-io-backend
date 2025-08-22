import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { ListGameRoomsQueryFactory } from '@module/game-room/use-cases/list-game-rooms/__spec__/list-game-rooms-query.factory';
import { ListGameRoomsHandler } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.handler';
import { ListGameRoomsQuery } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.query';

describe(ListGameRoomsHandler.name, () => {
  let handler: ListGameRoomsHandler;

  let gameRoomRepository: GameRoomRepositoryPort;

  let query: ListGameRoomsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameRoomRepositoryModule],
      providers: [ListGameRoomsHandler],
    }).compile();

    handler = module.get<ListGameRoomsHandler>(ListGameRoomsHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
  });

  beforeEach(() => {
    query = ListGameRoomsQueryFactory.build();
  });

  describe('게임방 목록을 조회하면.', () => {
    beforeEach(async () => {
      await Promise.all(
        GameRoomFactory.buildList(5).map((gameRoom) =>
          gameRoomRepository.insert(gameRoom),
        ),
      );
    });

    it('게임방 목록이 조회돼야한다.', async () => {
      await expect(handler.execute(query)).resolves.toSatisfyAll(
        (gameRoom) => gameRoom instanceof GameRoom,
      );
    });
  });
});
