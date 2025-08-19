import { Test, TestingModule } from '@nestjs/testing';

import { RoomMemberFactory } from '@module/game-room/entities/__spec__/room-member.factory';
import { RoomMember } from '@module/game-room/entities/room-member.entity';
import { RoomMemberRepository } from '@module/game-room/repositories/room-member/room-member.repository';
import {
  ROOM_MEMBER_REPOSITORY,
  RoomMemberRepositoryPort,
} from '@module/game-room/repositories/room-member/room-member.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(RoomMemberRepository, () => {
  let repository: RoomMemberRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: ROOM_MEMBER_REPOSITORY,
          useClass: RoomMemberRepository,
        },
      ],
    }).compile();

    repository = module.get<RoomMemberRepositoryPort>(ROOM_MEMBER_REPOSITORY);
  });

  describe(RoomMemberRepository.prototype.findOneById, () => {
    let roomMemberId: string;

    beforeEach(() => {
      roomMemberId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let roomMember: RoomMember;

      beforeEach(async () => {
        roomMember = await repository.insert(
          RoomMemberFactory.build({ id: roomMemberId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(roomMemberId)).resolves.toEqual(
            roomMember,
          );
        });
      });
    });
  });

  describe(RoomMemberRepository.prototype.findByAccountIdInGameRoom, () => {
    let accountId: string;
    let gameRoomId: string;

    beforeEach(() => {
      accountId = generateEntityId();
      gameRoomId = generateEntityId();
    });

    describe('식별자와 일치하는 멤버가 존재하는 경우', () => {
      let roomMember: RoomMember;

      beforeEach(async () => {
        roomMember = await repository.insert(
          RoomMemberFactory.build({
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
            id: roomMember.id,
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
