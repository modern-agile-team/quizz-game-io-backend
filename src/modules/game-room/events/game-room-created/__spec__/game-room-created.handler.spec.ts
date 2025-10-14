import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { GameRoomFactory } from '@module/game-room/entities/__spec__/game-room.factory';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { MockSocketEventPublisherModule } from '@core/socket/event-publisher/__mock__/socket-event.publisher.mock';
import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

describe(GameRoomCreatedHandler, () => {
  let handler: GameRoomCreatedHandler;

  let gameRoomRepository: GameRoomRepositoryPort;
  let eventPublisher: ISocketEventPublisher;

  let event: GameRoomCreatedEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        GameRoomRepositoryModule,
        MockSocketEventPublisherModule,
      ],
      providers: [GameRoomCreatedHandler],
    }).compile();

    handler = module.get<GameRoomCreatedHandler>(GameRoomCreatedHandler);

    gameRoomRepository =
      module.get<GameRoomRepositoryPort>(GAME_ROOM_REPOSITORY);
    eventPublisher = module.get<ISocketEventPublisher>(SOCKET_EVENT_PUBLISHER);
  });

  beforeEach(() => {
    jest
      .spyOn(eventPublisher, 'publishToLobby')
      .mockResolvedValue(undefined as never);
  });

  let gameRoom: GameRoom;

  beforeEach(async () => {
    gameRoom = GameRoomFactory.build();

    event = new GameRoomCreatedEvent(gameRoom.id, {
      hostAccountId: gameRoom.hostAccountId,
      status: gameRoom.status,
      visibility: gameRoom.visibility,
      title: gameRoom.title,
      maxPlayers: gameRoom.maxMembersCount,
      currentMembersCount: gameRoom.currentMembersCount,
      quizTimeLimitInSeconds: gameRoom.props.quizTimeLimitInSeconds,
      quizzesCount: gameRoom.quizzesCount,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('게임방이 생성되면', () => {
    beforeEach(async () => {
      await gameRoomRepository.insert(gameRoom);
    });

    it('소켓 이벤트를 발생시켜야한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(eventPublisher.publishToLobby).toHaveBeenCalled();
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
