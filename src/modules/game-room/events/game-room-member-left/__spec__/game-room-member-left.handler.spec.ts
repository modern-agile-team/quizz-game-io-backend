import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import { GameRoomMemberLeftHandler } from '@module/game-room/events/game-room-member-left/game-room-member-left.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { MockSocketEventPublisherModule } from '@core/socket/event-publisher/__mock__/socket-event.publisher.mock';
import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

describe(GameRoomMemberLeftHandler, () => {
  let handler: GameRoomMemberLeftHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let eventPublisher: ISocketEventPublisher;

  let event: GameRoomMemberLeftEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GameRoomRepositoryModule, MockSocketEventPublisherModule],
      providers: [GameRoomMemberLeftHandler],
    }).compile();

    handler = module.get<GameRoomMemberLeftHandler>(GameRoomMemberLeftHandler);
    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventPublisher = module.get<ISocketEventPublisher>(SOCKET_EVENT_PUBLISHER);
  });

  beforeEach(() => {
    jest
      .spyOn(eventPublisher, 'publishToLobby')
      .mockResolvedValue(undefined as never);
    jest
      .spyOn(eventPublisher, 'leaveAndPublishToGameRoom')
      .mockResolvedValue(undefined as never);
  });

  let gameRoom: GameRoom;

  beforeEach(async () => {
    gameRoom = GameRoomFactory.build({
      currentMembersCount: 1,
    });

    event = new GameRoomMemberLeftEvent(gameRoom.id, {
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

  describe('게임방에 멤버가 퇴장하면', () => {
    beforeEach(async () => {
      await gameRoomRepository.insert(gameRoom);
    });

    it('이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
      expect(eventPublisher.leaveAndPublishToGameRoom).toHaveBeenCalled();
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
