import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';
import { GameRoomMemberRoleChangedHandler } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { MockSocketEventPublisherModule } from '@core/socket/event-publisher/__mock__/socket-event.publisher.mock';
import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

describe(GameRoomMemberRoleChangedHandler, () => {
  let handler: GameRoomMemberRoleChangedHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let eventPublisher: ISocketEventPublisher;

  let event: GameRoomMemberRoleChangedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        GameRoomRepositoryModule,
        MockSocketEventPublisherModule,
      ],
      providers: [GameRoomMemberRoleChangedHandler],
    }).compile();

    handler = module.get<GameRoomMemberRoleChangedHandler>(
      GameRoomMemberRoleChangedHandler,
    );

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventPublisher = module.get<ISocketEventPublisher>(SOCKET_EVENT_PUBLISHER);
  });

  beforeEach(() => {
    jest
      .spyOn(eventPublisher, 'publishToGameRoom')
      .mockResolvedValue(undefined as never);
  });

  let gameRoom: GameRoom;

  beforeEach(() => {
    gameRoom = GameRoomFactory.build();

    event = new GameRoomMemberRoleChangedEvent(gameRoom.id, {
      gameRoomId: gameRoom.id,
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
    beforeEach(async () => {
      await gameRoomRepository.insert(gameRoom);
    });

    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToGameRoom).toHaveBeenCalled();
    });
  });

  describe('게임방이 존재하지 않는 경우', () => {
    it('게임방이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.handle(event)).rejects.toThrow(
        GameRoomNotFoundError,
      );
    });
  });
});
