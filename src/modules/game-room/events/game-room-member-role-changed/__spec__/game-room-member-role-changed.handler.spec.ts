import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';
import { GameRoomMemberRoleChangedHandler } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.handler';

import { generateEntityId } from '@common/base/base.entity';

import { SocketSessionManagerModule } from '@core/socket/session-manager/socket-session.manager.module';
import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(GameRoomMemberRoleChangedHandler, () => {
  let handler: GameRoomMemberRoleChangedHandler;

  let socketEmitter: ISocketEventEmitter;

  let event: GameRoomMemberRoleChangedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SocketEventEmitterModule, SocketSessionManagerModule],
      providers: [GameRoomMemberRoleChangedHandler],
    }).compile();

    handler = module.get<GameRoomMemberRoleChangedHandler>(
      GameRoomMemberRoleChangedHandler,
    );
    socketEmitter = module.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
  });

  beforeEach(() => {
    jest
      .spyOn(socketEmitter, 'emitToRoom')
      .mockResolvedValue(undefined as never);
  });

  beforeEach(async () => {
    const gameRoomId = generateEntityId();
    event = new GameRoomMemberRoleChangedEvent(gameRoomId, {
      gameRoomId,
      accountId: generateEntityId(),
      memberId: generateEntityId(),
      role: GameRoomMemberRole.player,
      nickname: generateEntityId(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방의 구성원 역할이 변경되면', () => {
    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(socketEmitter.emitToRoom).toHaveBeenCalled();
    });
  });
});
