import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';

import { generateEntityId } from '@common/base/base.entity';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(GameRoomCreatedHandler, () => {
  let handler: GameRoomCreatedHandler;

  let socketEmitter: ISocketEventEmitter;

  let event: GameRoomCreatedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SocketEventEmitterModule],
      providers: [GameRoomCreatedHandler],
    }).compile();

    handler = module.get<GameRoomCreatedHandler>(GameRoomCreatedHandler);
    socketEmitter = module.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
  });

  beforeEach(() => {
    jest
      .spyOn(socketEmitter, 'emitToNamespace')
      .mockResolvedValue(undefined as never);
  });

  beforeEach(async () => {
    const gameRoomId = generateEntityId();
    event = new GameRoomCreatedEvent(gameRoomId, {
      hostId: generateEntityId(),
      status: GameRoomStatus.waiting,
      visibility: GameRoomVisibility.public,
      title: 'title',
      maxPlayers: 8,
      currentMembersCount: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방이 생성되면', () => {
    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(socketEmitter.emitToNamespace).toHaveBeenCalled();
    });
  });
});
