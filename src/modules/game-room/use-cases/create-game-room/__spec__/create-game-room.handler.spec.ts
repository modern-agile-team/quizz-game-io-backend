import { Test, TestingModule } from '@nestjs/testing';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { CreateGameRoomCommandFactory } from '@module/game-room/use-cases/create-game-room/__spec__/create-game-room-command.factory';
import { CreateGameRoomCommand } from '@module/game-room/use-cases/create-game-room/create-game-room.command';
import { CreateGameRoomHandler } from '@module/game-room/use-cases/create-game-room/create-game-room.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateGameRoomHandler.name, () => {
  let handler: CreateGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: CreateGameRoomCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameRoomRepositoryModule, EventStoreModule],
      providers: [CreateGameRoomHandler],
    }).compile();

    handler = module.get<CreateGameRoomHandler>(CreateGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateGameRoomCommandFactory.build();
  });

  describe('게임방을 생성하면.', () => {
    it('게임방이 생성돼야한다.', async () => {
      const gameRoom = await handler.execute(command);

      await expect(
        gameRoomRepository.findOneById(gameRoom.id),
      ).resolves.toEqual(
        expect.objectContaining({
          id: gameRoom.id,
          title: command.title,
        }),
      );
    });
  });
});
