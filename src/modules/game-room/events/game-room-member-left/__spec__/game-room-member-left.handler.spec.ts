import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import { GameRoomMemberLeftHandler } from '@module/game-room/events/game-room-member-left/game-room-member-left.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { CacheModule } from '@shared/cache/cache.module';

import { SocketSessionManagerModule } from '@core/socket/session-manager/socket-session.manager.module';
import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(GameRoomMemberLeftHandler, () => {
  let handler: GameRoomMemberLeftHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let socketEmitter: ISocketEventEmitter;

  let event: GameRoomMemberLeftEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        SocketEventEmitterModule,
        SocketSessionManagerModule,
        CacheModule,
      ],
      providers: [GameRoomMemberLeftHandler],
    }).compile();

    handler = module.get<GameRoomMemberLeftHandler>(GameRoomMemberLeftHandler);
    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    socketEmitter = module.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
  });

  beforeEach(() => {
    jest
      .spyOn(socketEmitter, 'emitToRoom')
      .mockResolvedValue(undefined as never);
    jest.spyOn(gameRoomRepository, 'decrementCurrentMembersCount');
  });

  let existingGameRoom: GameRoom;

  beforeEach(async () => {
    const gameRoomId = generateEntityId();
    event = new GameRoomMemberLeftEvent(gameRoomId, {
      gameRoomId,
      accountId: generateEntityId(),
      memberId: generateEntityId(),
      role: GameRoomMemberRole.player,
      nickname: generateEntityId(),
    });

    existingGameRoom = await gameRoomRepository.insert(
      GameRoomFactory.build({
        id: gameRoomId,
        currentMembersCount: 1,
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방에 멤버가 입장하면', () => {
    it('현재 멤버 수를 1 감소시키고 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      await expect(
        gameRoomRepository.findOneById(existingGameRoom.id),
      ).resolves.toEqual(
        expect.objectContaining({
          currentMembersCount: existingGameRoom.currentMembersCount - 1,
        }),
      );
      expect(socketEmitter.emitToRoom).toHaveBeenCalled();
    });
  });
});
