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
import { MockGameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/__mock__/game-room-socket-event.publisher.mock';
import {
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

import { generateEntityId } from '@common/base/base.entity';

describe(GameRoomMemberLeftHandler, () => {
  let handler: GameRoomMemberLeftHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let eventPublisher: IGameRoomSocketEventPublisher;

  let event: GameRoomMemberLeftEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GameRoomRepositoryModule,
        MockGameRoomSocketEventPublisherModule,
      ],
      providers: [GameRoomMemberLeftHandler],
    }).compile();

    handler = module.get<GameRoomMemberLeftHandler>(GameRoomMemberLeftHandler);
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
      .spyOn(eventPublisher, 'leaveAndPublishToGameRoom')
      .mockResolvedValue(undefined as never);
  });

  let existingGameRoom: GameRoom;

  beforeEach(async () => {
    existingGameRoom = await gameRoomRepository.insert(
      GameRoomFactory.build({
        currentMembersCount: 1,
      }),
    );

    event = new GameRoomMemberLeftEvent(existingGameRoom.id, {
      gameRoomId: existingGameRoom.id,
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
    it('이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
      expect(eventPublisher.leaveAndPublishToGameRoom).toHaveBeenCalled();
    });
  });
});
