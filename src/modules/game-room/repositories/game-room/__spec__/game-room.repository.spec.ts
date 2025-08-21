import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomRepository } from '@module/game-room/repositories/game-room/game-room.repository';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { RecordNotFoundError } from '@common/base/base.error';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(GameRoomRepository, () => {
  let repository: GameRoomRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
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

  describe(GameRoomRepository.prototype.incrementCurrentMembersCount, () => {
    let gameRoom: GameRoom;

    beforeEach(async () => {
      gameRoom = await repository.insert(GameRoomFactory.build());
    });

    describe('현재 멤버 카운트를 증가시키면', () => {
      it('현재 멤버 수가 1 증가해야한다.', async () => {
        await expect(
          repository.incrementCurrentMembersCount(gameRoom.id),
        ).resolves.toBe(gameRoom.currentMembersCount + 1);
      });
    });

    describe('게임방이 존재하지 않는 경우', () => {
      it('레코드가 존재하지 않는다는 에러가 발생해야한다.', async () => {
        await expect(
          repository.incrementCurrentMembersCount(generateEntityId()),
        ).rejects.toThrow(RecordNotFoundError);
      });
    });
  });
});
