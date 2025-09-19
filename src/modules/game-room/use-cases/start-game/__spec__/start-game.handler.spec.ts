import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import {
  GameRoom,
  GameRoomStatus,
} from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { StartGameCommandFactory } from '@module/game-room/use-cases/start-game/__spec__/start-game-command.factory';
import { StartGameCommand } from '@module/game-room/use-cases/start-game/start-game.command';
import { StartGameHandler } from '@module/game-room/use-cases/start-game/start-game.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(StartGameHandler.name, () => {
  let handler: StartGameHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: StartGameCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameRoomRepositoryModule, EventStoreModule],
      providers: [StartGameHandler],
    }).compile();

    handler = module.get<StartGameHandler>(StartGameHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = StartGameCommandFactory.build();
  });

  describe('대기 상태의 게임방이 존재하는 경우', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let waitingStatusGameRoom: GameRoom;

    beforeEach(async () => {
      waitingStatusGameRoom = await gameRoomRepository.insert(
        GameRoomFactory.build({
          id: command.gameRoomId,
          status: GameRoomStatus.waiting,
        }),
      );
    });

    it('게임이 시작되어야한다.', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          status: GameRoomStatus.starting,
        }),
      );
    });
  });

  describe('게임방이 존재하지 않는 경우', () => {
    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      expect(handler.execute(command)).rejects.toThrow(GameRoomNotFoundError);
    });
  });
});
