import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomMemberFactory } from '@module/game-room/entities/__spec__/game-room-member.factory';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberRepository } from '@module/game-room/repositories/game-room-member/game-room-member.repository';
import {
  GAME_ROOM_MEMBER_REPOSITORY,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(GameRoomMemberRepository, () => {
  let repository: GameRoomMemberRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: GAME_ROOM_MEMBER_REPOSITORY,
          useClass: GameRoomMemberRepository,
        },
      ],
    }).compile();

    repository = module.get<GameRoomMemberRepositoryPort>(
      GAME_ROOM_MEMBER_REPOSITORY,
    );
  });

  describe(GameRoomMemberRepository.prototype.findOneById, () => {
    let gameRoomMemberId: string;

    beforeEach(() => {
      gameRoomMemberId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let gameRoomMember: GameRoomMember;

      beforeEach(async () => {
        gameRoomMember = await repository.insert(
          GameRoomMemberFactory.build({ id: gameRoomMemberId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(gameRoomMemberId),
          ).resolves.toEqual(gameRoomMember);
        });
      });
    });
  });

  describe(GameRoomMemberRepository.prototype.findByGameRoomId, () => {
    let gameRoomId: string;
    let gameRoomMembers: GameRoomMember[];

    beforeEach(async () => {
      gameRoomId = generateEntityId();

      gameRoomMembers = await Promise.all(
        GameRoomMemberFactory.buildList(3, { gameRoomId }).map(
          (gameRoomMember) => repository.insert(gameRoomMember),
        ),
      );
    });

    describe('특정 게임방의 구성원 목록을 조회하면', () => {
      it('게임방의 소속된 구성원 목록을 반환해야한다.', async () => {
        await expect(repository.findByGameRoomId(gameRoomId)).resolves.toEqual(
          expect.arrayContaining(gameRoomMembers),
        );
      });
    });
  });

  describe(GameRoomMemberRepository.prototype.findByAccountIdInGameRoom, () => {
    let accountId: string;
    let gameRoomId: string;

    beforeEach(() => {
      accountId = generateEntityId();
      gameRoomId = generateEntityId();
    });

    describe('식별자와 일치하는 멤버가 존재하는 경우', () => {
      let gameRoomMember: GameRoomMember;

      beforeEach(async () => {
        gameRoomMember = await repository.insert(
          GameRoomMemberFactory.build({
            accountId,
            gameRoomId: gameRoomId,
          }),
        );
      });

      it('게임방에 참여한 멤버를 조회할 수 있어야 한다.', async () => {
        await expect(
          repository.findByAccountIdInGameRoom(accountId, gameRoomId),
        ).resolves.toEqual(
          expect.objectContaining({
            id: gameRoomMember.id,
            accountId,
            gameRoomId: gameRoomId,
          }),
        );
      });
    });

    describe('식별자와 일치하는 멤버가 존재하지 않는 경우', () => {
      it('undefined를 반환해야 한다.', async () => {
        await expect(
          repository.findByAccountIdInGameRoom('999', '456'),
        ).resolves.toBeUndefined();
      });
    });
  });
});
