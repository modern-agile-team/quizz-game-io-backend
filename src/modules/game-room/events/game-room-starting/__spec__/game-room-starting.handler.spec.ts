import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import {
  GameRoom,
  GameRoomStatus,
} from '@module/game-room/entities/game-room.entity';
import { GameRoomStartingEvent } from '@module/game-room/events/game-room-starting/game-room-starting.event';
import { GameRoomStartingHandler } from '@module/game-room/events/game-room-starting/game-room-starting.handler';
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

describe(GameRoomStartingHandler, () => {
  let handler: GameRoomStartingHandler;

  let gameRoomRepository: GameRoomRepositoryPort;

  let eventPublisher: IGameRoomSocketEventPublisher;

  let event: GameRoomStartingEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        MockGameRoomSocketEventPublisherModule,
      ],
      providers: [GameRoomStartingHandler],
    }).compile();

    handler = module.get<GameRoomStartingHandler>(GameRoomStartingHandler);
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
    jest
      .spyOn(eventPublisher, 'publishToGameRoom')
      .mockResolvedValue(undefined as never);
  });

  let existingGameRoom: GameRoom;

  beforeEach(async () => {
    existingGameRoom = await gameRoomRepository.insert(
      GameRoomFactory.build({}),
    );

    event = new GameRoomStartingEvent(existingGameRoom.id, {
      gameRoomId: existingGameRoom.id,
      status: GameRoomStatus.starting,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방이 폐쇄되면', () => {
    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
      expect(eventPublisher.publishToGameRoom).toHaveBeenCalled();
    });
  });
});
