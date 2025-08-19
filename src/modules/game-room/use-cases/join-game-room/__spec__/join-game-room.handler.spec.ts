import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { RoomMemberFactory } from '@module/game-room/entities/__spec__/room-member.factory';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { RoomMember } from '@module/game-room/entities/room-member.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { RoomMemberAlreadyExistsError } from '@module/game-room/errors/room-member-already-exists.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { RoomMemberRepositoryModule } from '@module/game-room/repositories/room-member/room-member.repository.module';
import {
  ROOM_MEMBER_REPOSITORY,
  RoomMemberRepositoryPort,
} from '@module/game-room/repositories/room-member/room-member.repository.port';
import { JoinGameRoomCommandFactory } from '@module/game-room/use-cases/join-game-room/__spec__/join-game-room-command.factory';
import { JoinGameRoomCommand } from '@module/game-room/use-cases/join-game-room/join-game-room.command';
import { JoinGameRoomHandler } from '@module/game-room/use-cases/join-game-room/join-game-room.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(JoinGameRoomHandler.name, () => {
  let handler: JoinGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let roomMemberRepository: RoomMemberRepositoryPort;
  let eventStore: IEventStore;

  let command: JoinGameRoomCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        RoomMemberRepositoryModule,
        EventStoreModule,
      ],
      providers: [JoinGameRoomHandler],
    }).compile();

    handler = module.get<JoinGameRoomHandler>(JoinGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    roomMemberRepository = module.get<RoomMemberRepositoryPort>(
      ROOM_MEMBER_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = JoinGameRoomCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let gameRoom: GameRoom;

  beforeEach(async () => {
    gameRoom = await gameRoomRepository.insert(
      GameRoomFactory.build({
        id: command.gameRoomId,
        maxMembersCount: 8,
        currentMembersCount: 1,
      }),
    );
  });

  describe('게임방에 참가하면', () => {
    it('게임방에 참가한 멤버를 반환한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeInstanceOf(
        RoomMember,
      );

      expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
    });
  });

  describe('게임방이 존재하지 않는 경우', () => {
    beforeEach(() => {
      command = JoinGameRoomCommandFactory.build();
    });

    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        GameRoomNotFoundError,
      );
    });
  });

  describe('이미 게임방에 참가한 경우', () => {
    beforeEach(async () => {
      await roomMemberRepository.insert(
        RoomMemberFactory.build({
          accountId: command.currentAccountId,
          gameRoomId: command.gameRoomId,
        }),
      );
    });

    it('이미 참가했다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        RoomMemberAlreadyExistsError,
      );
    });
  });
});
