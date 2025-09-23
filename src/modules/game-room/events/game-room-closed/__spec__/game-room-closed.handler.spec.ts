import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';

import { generateEntityId } from '@common/base/base.entity';

import { MockSocketEventPublisherModule } from '@core/socket/event-publisher/__mock__/socket-event.publisher.mock';
import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

describe(GameRoomClosedHandler, () => {
  let handler: GameRoomClosedHandler;

  let eventPublisher: ISocketEventPublisher;

  let event: GameRoomClosedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockSocketEventPublisherModule],
      providers: [GameRoomClosedHandler],
    }).compile();

    handler = module.get<GameRoomClosedHandler>(GameRoomClosedHandler);
    eventPublisher = module.get<ISocketEventPublisher>(SOCKET_EVENT_PUBLISHER);
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
