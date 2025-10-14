import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomRepository } from '@module/game-room/repositories/game-room/game-room.repository';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(GameRoomRepository, () => {
  let repository: GameRoomRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory()],
      providers: [
        {
          provide: GAME_ROOM_REPOSITORY,
          useClass: GameRoomRepository,
        },
      ],
    }).compile();

    repository = module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
  });

  describe(GameRoomRepository.prototype.findOneById, () => {
    let gameRoomId: string;

    beforeEach(() => {
      gameRoomId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let gameRoom: GameRoom;

      beforeEach(async () => {
        gameRoom = await repository.insert(
          GameRoomFactory.build({ id: gameRoomId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(gameRoomId)).resolves.toEqual(
            gameRoom,
          );
        });
      });
    });
  });

  describe(GameRoomRepository.prototype.findAll, () => {
    beforeEach(async () => {
      await Promise.all(
        GameRoomFactory.buildList(5).map((gameRoom) =>
          repository.insert(gameRoom),
        ),
      );
    });

    it('게임 방 목록을 조회할 수 있다.', async () => {
      await expect(repository.findAll({})).resolves.toSatisfyAll(
        (gameRoom) => gameRoom instanceof GameRoom,
      );
    });

    it('생성일 기준 정렬이 가능하다.', async () => {
      await expect(
        repository.findAll({
          sort: [{ field: 'createdAt', direction: 'asc' }],
        }),
      ).resolves.toBeSortedBy('createdAt', {
        descending: false,
      });
    });
  });
});
