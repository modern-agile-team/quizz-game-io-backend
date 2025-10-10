import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { CreateGameRoomCommandFactory } from '@module/game-room/use-cases/create-game-room/__spec__/create-game-room-command.factory';
import { CreateGameRoomCommand } from '@module/game-room/use-cases/create-game-room/create-game-room.command';
import { CreateGameRoomHandler } from '@module/game-room/use-cases/create-game-room/create-game-room.handler';

import { ClaModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateGameRoomHandler.name, () => {
  let handler: CreateGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let accountRepository: AccountRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: CreateGameRoomCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClaModuleFactory(),
        GameRoomRepositoryModule,
        AccountRepositoryModule,
        EventStoreModule,
      ],
      providers: [CreateGameRoomHandler],
    }).compile();

    handler = module.get<CreateGameRoomHandler>(CreateGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateGameRoomCommandFactory.build();
  });

  describe('게임방을 생성하면.', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({
          id: command.currentAccountId,
        }),
      );
    });

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

  describe('계정이 존재하지 않으면', () => {
    it('계정이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        AccountNotFoundError,
      );
    });
  });
});
