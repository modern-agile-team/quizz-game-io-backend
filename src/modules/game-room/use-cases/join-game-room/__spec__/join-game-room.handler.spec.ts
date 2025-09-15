import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { JoinGameRoomCommandFactory } from '@module/game-room/use-cases/join-game-room/__spec__/join-game-room-command.factory';
import { JoinGameRoomCommand } from '@module/game-room/use-cases/join-game-room/join-game-room.command';
import { JoinGameRoomHandler } from '@module/game-room/use-cases/join-game-room/join-game-room.handler';

import { generateEntityId } from '@common/base/base.entity';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(JoinGameRoomHandler.name, () => {
  let handler: JoinGameRoomHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let accountRepository: AccountRepositoryPort;
  let eventStore: IEventStore;

  let command: JoinGameRoomCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        AccountRepositoryModule,
        EventStoreModule,
      ],
      providers: [JoinGameRoomHandler],
    }).compile();

    handler = module.get<JoinGameRoomHandler>(JoinGameRoomHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
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
      }),
    );
    await accountRepository.insert(
      AccountFactory.build({ id: command.currentAccountId }),
    );
  });

  describe('게임방에 참가하면', () => {
    it('게임방에 참가한 멤버를 반환한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeInstanceOf(
        GameRoomMember,
      );

      expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
    });
  });

  describe('게임방이 존재하지 않는 경우', () => {
    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(
        handler.execute({ ...command, gameRoomId: generateEntityId() }),
      ).rejects.toThrow(GameRoomNotFoundError);
    });
  });

  describe('계정이 존재하지 않으면', () => {
    it('계정이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(
        handler.execute({ ...command, currentAccountId: generateEntityId() }),
      ).rejects.toThrow(AccountNotFoundError);
    });
  });
});
