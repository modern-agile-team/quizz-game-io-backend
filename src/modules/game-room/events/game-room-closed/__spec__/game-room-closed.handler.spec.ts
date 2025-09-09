import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';

import { generateEntityId } from '@common/base/base.entity';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(GameRoomClosedHandler, () => {
  let handler: GameRoomClosedHandler;

  let socketEmitter: ISocketEventEmitter;

  let event: GameRoomClosedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SocketEventEmitterModule],
      providers: [GameRoomClosedHandler],
    }).compile();

    handler = module.get<GameRoomClosedHandler>(GameRoomClosedHandler);
    socketEmitter = module.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
  });

  beforeEach(() => {
    jest
      .spyOn(socketEmitter, 'emitToNamespace')
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

      expect(socketEmitter.emitToNamespace).toHaveBeenCalled();
    });
  });
});
