import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomMemberFactory } from '@module/game-room/entities/__spec__/game-room-member.factory';
import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberNotFoundError } from '@module/game-room/errors/game-room-member-not-found.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomMemberRepositoryModule } from '@module/game-room/repositories/game-room-member/game-room-member.repository.module';
import {
  GAME_ROOM_MEMBER_REPOSITORY,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { LeaveGameRoomCommandFactory } from '@module/game-room/use-cases/leave-game-room/__spec__/leave-game-room-command.factory';
import { LeaveGameRoomCommand } from '@module/game-room/use-cases/leave-game-room/leave-game-room.command';
import { LeaveGameRoomHandler } from '@module/game-room/use-cases/leave-game-room/leave-game-room.handler';

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(LeaveGameRoomHandler.name, () => {
  let handler: LeaveGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let gameRoomMemberRepository: GameRoomMemberRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: LeaveGameRoomCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        GameRoomMemberRepositoryModule,
        EventStoreModule,
      ],
      providers: [LeaveGameRoomHandler],
    }).compile();

    handler = module.get<LeaveGameRoomHandler>(LeaveGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    gameRoomMemberRepository = module.get<GameRoomMemberRepositoryPort>(
      GAME_ROOM_MEMBER_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = LeaveGameRoomCommandFactory.build();
  });

  let gameRoom: GameRoom;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let hostMember: GameRoomMember;

  beforeEach(async () => {
    gameRoom = await gameRoomRepository.insert(
      GameRoomFactory.build({
        id: command.gameRoomId,
        hostId: command.currentAccountId,
      }),
    );
    hostMember = await gameRoomMemberRepository.insert(
      GameRoomMemberFactory.build({
        accountId: command.currentAccountId,
        gameRoomId: command.gameRoomId,
      }),
    );
  });

  describe('호스트가 게임에서 나가는 경우', () => {
    describe('남은 플레이어가 있다면', () => {
      let nextHostMember: GameRoomMember;

      beforeEach(async () => {
        nextHostMember = await gameRoomMemberRepository.insert(
          GameRoomMemberFactory.build({ gameRoomId: command.gameRoomId }),
        );
      });

      it('남은 플레이어가 있다면 방장을 위임해야한다', async () => {
        await expect(handler.execute(command)).resolves.toBeUndefined();

        await expect(
          gameRoomRepository.findOneById(gameRoom.id),
        ).resolves.toEqual(
          expect.objectContaining({
            hostId: nextHostMember.accountId,
          }),
        );
      });
    });
  });

  describe('플레이어가 방에서 나가는 경우', () => {
    let player: GameRoomMember;

    beforeEach(async () => {
      player = await gameRoomMemberRepository.insert(
        GameRoomMemberFactory.build({ gameRoomId: command.gameRoomId }),
      );
    });

    it('방에서 나가야 한다.', async () => {
      await expect(
        handler.execute({ ...command, currentAccountId: player.accountId }),
      ).resolves.toBeUndefined();

      await expect(
        gameRoomMemberRepository.findByAccountIdInGameRoom(
          player.accountId,
          gameRoom.id,
        ),
      ).resolves.toBeUndefined();
    });
  });

  describe('마지막 플레어어가 나가는 경우', () => {
    it('방이 삭제돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeUndefined();

      await expect(
        gameRoomRepository.findOneById(command.gameRoomId),
      ).resolves.toBeUndefined();
    });
  });

  describe('게임방이 존재하지 않는 경우', () => {
    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(
        handler.execute({ ...command, gameRoomId: generateEntityId() }),
      ).rejects.toThrow(GameRoomNotFoundError);
    });
  });

  describe('사용자가 게임방의 참가자가 아닌 경우', () => {
    it('게임방의 구성원이 아니라는 에러가 발생해야한다.', async () => {
      await expect(
        handler.execute({ ...command, currentAccountId: generateEntityId() }),
      ).rejects.toThrow(GameRoomMemberNotFoundError);
    });
  });
});
