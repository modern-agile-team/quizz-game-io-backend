import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomStartingEvent } from '@module/game-room/events/game-room-starting/game-room-starting.event';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  GameRoomChangedSocketEvent,
  GameRoomChangedSocketEventAction,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

@AsyncApi()
export class GameRoomStartingHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(GameRoomStartingEvent.name)
  async handle(event: GameRoomStartingEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    this.publishGameRoomEvent(gameRoom as GameRoom);
    this.publishLobbyEvent(gameRoom as GameRoom);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '게임 시작 처리',
    channel: GameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomChangedSocketEvent },
  })
  private publishGameRoomEvent(gameRoom: GameRoom): void {
    const socketEvent = new GameRoomChangedSocketEvent(
      GameRoomChangedSocketEventAction.game_starting,
      GameRoomDtoAssembler.convertToSocketEventDto(gameRoom),
    );

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(gameRoom.id),
      socketEvent,
    );
  }

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임 시작 처리',
    channel: LobbyGameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomChangedSocketEvent },
  })
  private publishLobbyEvent(gameRoom: GameRoom): void {
    const socketEvent = new LobbyGameRoomChangedSocketEvent(
      GameRoomChangedSocketEventAction.game_starting,
      GameRoomDtoAssembler.convertToSocketEventDto(gameRoom),
    );

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
