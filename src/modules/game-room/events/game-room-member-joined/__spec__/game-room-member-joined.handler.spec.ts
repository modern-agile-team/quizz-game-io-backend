import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';
import { GameRoomMemberJoinedHandler } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.handler';
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

import { generateEntityId } from '@common/base/base.entity';

describe(GameRoomMemberJoinedHandler, () => {
  let handler: GameRoomMemberJoinedHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let eventPublisher: IGameRoomSocketEventPublisher;

  let event: GameRoomMemberJoinedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        MockGameRoomSocketEventPublisherModule,
      ],
      providers: [GameRoomMemberJoinedHandler],
    }).compile();

    handler = module.get<GameRoomMemberJoinedHandler>(
      GameRoomMemberJoinedHandler,
    );
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
      .spyOn(eventPublisher, 'joinAndPublishToGameRoom')
      .mockResolvedValue(undefined as never);
  });

  beforeEach(async () => {
    const gameRoom = await gameRoomRepository.insert(GameRoomFactory.build());
    event = new GameRoomMemberJoinedEvent(gameRoom.id, {
      gameRoomId: gameRoom.id,
      accountId: generateEntityId(),
      role: GameRoomMemberRole.player,
      nickname: generateEntityId(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방에 멤버가 입장하면', () => {
    it('이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
      expect(eventPublisher.joinAndPublishToGameRoom).toHaveBeenCalled();
    });
  });
});
