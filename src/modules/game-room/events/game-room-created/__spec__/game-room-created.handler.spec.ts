import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import { MockGameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/__mock__/game-room-socket-event.publisher.mock';
import {
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

describe(GameRoomCreatedHandler, () => {
  let handler: GameRoomCreatedHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let eventPublisher: IGameRoomSocketEventPublisher;

  let event: GameRoomCreatedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        MockGameRoomSocketEventPublisherModule,
      ],
      providers: [GameRoomCreatedHandler],
    }).compile();

    handler = module.get<GameRoomCreatedHandler>(GameRoomCreatedHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventPublisher = module.get<IGameRoomSocketEventPublisher>(
      GAME_ROOM_SOCKET_EVENT_PUBLISHER,
    );
  });

  beforeEach(() => {
    jest
      .spyOn(eventPublisher, 'publishToLobby')
      .mockResolvedValue(undefined as never);
  });

  beforeEach(async () => {
    const gameRoom = await gameRoomRepository.insert(GameRoomFactory.build());

    event = new GameRoomCreatedEvent(gameRoom.id, {
      hostAccountId: gameRoom.hostAccountId,
      status: gameRoom.status,
      visibility: gameRoom.visibility,
      title: gameRoom.title,
      maxPlayers: gameRoom.maxMembersCount,
      currentMembersCount: gameRoom.currentMembersCount,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방이 생성되면', () => {
    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
    });
  });
});
