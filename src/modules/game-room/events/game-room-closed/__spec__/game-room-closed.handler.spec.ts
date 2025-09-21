import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';
import { MockGameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/__mock__/game-room-socket-event.publisher.mock';
import {
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

import { generateEntityId } from '@common/base/base.entity';

describe(GameRoomClosedHandler, () => {
  let handler: GameRoomClosedHandler;

  let eventPublisher: IGameRoomSocketEventPublisher;

  let event: GameRoomClosedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockGameRoomSocketEventPublisherModule],
      providers: [GameRoomClosedHandler],
    }).compile();

    handler = module.get<GameRoomClosedHandler>(GameRoomClosedHandler);
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
    const gameRoomId = generateEntityId();
    event = new GameRoomClosedEvent(gameRoomId, {
      gameRoomId,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방이 폐쇄되면', () => {
    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
    });
  });
});
