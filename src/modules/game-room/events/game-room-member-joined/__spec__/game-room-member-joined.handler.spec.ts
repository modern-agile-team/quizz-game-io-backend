import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { RoomMemberRole } from '@module/game-room/entities/room-member.entity';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';
import { GameRoomMemberJoinedHandler } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(GameRoomMemberJoinedHandler, () => {
  let handler: GameRoomMemberJoinedHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let socketEmitter: ISocketEventEmitter;

  let event: GameRoomMemberJoinedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameRoomRepositoryModule, SocketEventEmitterModule],
      providers: [GameRoomMemberJoinedHandler],
    }).compile();

    handler = module.get<GameRoomMemberJoinedHandler>(
      GameRoomMemberJoinedHandler,
    );
    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    socketEmitter = module.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
  });

  beforeEach(() => {
    jest
      .spyOn(socketEmitter, 'emitToRoom')
      .mockResolvedValue(undefined as never);
    jest.spyOn(gameRoomRepository, 'incrementCurrentMembersCount');
  });

  beforeEach(async () => {
    const gameRoomId = generateEntityId();
    event = new GameRoomMemberJoinedEvent(gameRoomId, {
      gameRoomId,
      accountId: generateEntityId(),
      role: RoomMemberRole.player,
    });

    await gameRoomRepository.insert(
      GameRoomFactory.build({
        id: gameRoomId,
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방에 멤버가 입장하면', () => {
    it('현재 멤버 수를 1 증가시키고 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(
        gameRoomRepository.incrementCurrentMembersCount,
      ).toHaveBeenCalled();
      expect(socketEmitter.emitToRoom).toHaveBeenCalled();
    });
  });
});
