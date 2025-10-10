import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomMemberFactory } from '@module/game-room/entities/__spec__/game-room-member.factory';
import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import {
  GameRoomMember,
  GameRoomMemberRole,
} from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberNotFoundError } from '@module/game-room/errors/game-room-member-not-found.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { LeaveGameRoomCommandFactory } from '@module/game-room/use-cases/leave-game-room/__spec__/leave-game-room-command.factory';
import { LeaveGameRoomCommand } from '@module/game-room/use-cases/leave-game-room/leave-game-room.command';
import { LeaveGameRoomHandler } from '@module/game-room/use-cases/leave-game-room/leave-game-room.handler';

import { generateEntityId } from '@common/base/base.entity';
import { ClaModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(LeaveGameRoomHandler.name, () => {
  let handler: LeaveGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: LeaveGameRoomCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClaModuleFactory(), GameRoomRepositoryModule, EventStoreModule],
      providers: [LeaveGameRoomHandler],
    }).compile();

    handler = module.get<LeaveGameRoomHandler>(LeaveGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = LeaveGameRoomCommandFactory.build();
  });

  let gameRoom: GameRoom;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let hostMember: GameRoomMember;

  beforeEach(async () => {
    hostMember = GameRoomMemberFactory.build({
      accountId: command.currentAccountId,
      role: GameRoomMemberRole.host,
    });
    gameRoom = await gameRoomRepository.insert(
      GameRoomFactory.build({
        id: command.gameRoomId,
        hostAccountId: command.currentAccountId,
        members: [hostMember],
      }),
    );
  });

  describe('호스트가 게임에서 나가는 경우', () => {
    describe('남은 플레이어가 있다면', () => {
      let nextHostMember: GameRoomMember;

      beforeEach(async () => {
        nextHostMember = GameRoomMemberFactory.build({
          role: GameRoomMemberRole.player,
        });
        gameRoom.joinMember(nextHostMember);
        await gameRoomRepository.update(gameRoom);
      });

      it('남은 플레이어가 방장을 위임해야한다', async () => {
        await expect(handler.execute(command)).resolves.toBeUndefined();

        const gameRoom = await gameRoomRepository.findOneById(
          command.gameRoomId,
        );

        expect(
          gameRoom?.members.find(
            (member) => member.accountId === nextHostMember.accountId,
          )?.role,
        ).toBe(GameRoomMemberRole.host);
      });
    });
  });

  describe('플레이어가 방에서 나가는 경우', () => {
    let player: GameRoomMember;

    beforeEach(async () => {
      player = GameRoomMemberFactory.build({ role: GameRoomMemberRole.player });
      gameRoom.joinMember(player);
      await gameRoomRepository.update(gameRoom);
    });

    it('방에서 나가야 한다.', async () => {
      await expect(
        handler.execute({ ...command, currentAccountId: player.accountId }),
      ).resolves.toBeUndefined();

      const gameRoom = await gameRoomRepository.findOneById(command.gameRoomId);

      expect(gameRoom?.members).toEqual(expect.not.arrayContaining([player]));
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
