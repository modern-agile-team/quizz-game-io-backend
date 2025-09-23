import { Inject, Injectable } from '@nestjs/common';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import {
  GameRoomChangedSocketEvent,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { LobbyGameRoomCreatedSocketEvent } from '@module/game-room/socket-events/game-room-created.socket-event';
import { LobbyGameRoomDeletedSocketEvent } from '@module/game-room/socket-events/game-room-deleted.socket-event';

import { InternalServerError } from '@common/base/base.error';

import {
  ISocketEventPublisher,
  PublishableSocketEvent,
} from '@core/socket/event-publisher/socket-event.publisher.interface';
import {
  ISocketSessionManager,
  SOCKET_SESSION_MANAGER,
} from '@core/socket/session-manager/socket-session.manager.interface';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

@AsyncApi()
@Injectable()
export class SocketEventPublisher implements ISocketEventPublisher {
  constructor(
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
    @Inject(SOCKET_SESSION_MANAGER)
    private readonly socketSessionManager: ISocketSessionManager,
  ) {}

  publishToLobby(event: PublishableSocketEvent): void {
    this.assertLobbyEvent(event);

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, event);
  }

  publishToGameRoom(gameRoomId: string, event: PublishableSocketEvent): void {
    this.assertGameRoomEvent(event);

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(gameRoomId),
      event,
    );
  }

  async joinAndPublishToGameRoom(
    accountId: string,
    gameRoomId: string,
    event: PublishableSocketEvent,
  ): Promise<void> {
    this.assertGameRoomEvent(event);

    await this.socketSessionManager.remoteJoinByAccount(
      accountId,
      gameRoomKeyOf(gameRoomId),
    );

    this.publishToGameRoom(gameRoomId, event);
  }

  async leaveAndPublishToGameRoom(
    accountId: string,
    gameRoomId: string,
    event: PublishableSocketEvent,
  ): Promise<void> {
    this.assertGameRoomEvent(event);

    await this.socketSessionManager.remoteLeaveByAccount(
      accountId,
      gameRoomKeyOf(gameRoomId),
    );

    this.publishToGameRoom(gameRoomId, event);
  }

  private assertLobbyEvent(event: PublishableSocketEvent): void {
    if (!event.eventName.startsWith('lobby.')) {
      throw new InternalServerError(
        `GameRoomSocketEventPublisher expected lobby event, received ${event.eventName}.`,
      );
    }
  }

  private assertGameRoomEvent(event: PublishableSocketEvent): void {
    if (!event.eventName.startsWith('game_room.')) {
      throw new InternalServerError(
        `GameRoomSocketEventPublisher expected game room event, received ${event.eventName}.`,
      );
    }
  }

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임방이 생성됨',
    channel: LobbyGameRoomCreatedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomCreatedSocketEvent },
  })
  private _lobbyGameRoomCreatedSocketEvent() {}

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임방의 상태 변경',
    channel: LobbyGameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomChangedSocketEvent },
  })
  private _lobbyGameRoomChangedSocketEvent() {}

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임방이 폐쇄됨',
    channel: LobbyGameRoomDeletedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomDeletedSocketEvent },
  })
  private _lobbyGameRoomDeletedSocketEvent() {}

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '게임방의 상태 변경',
    channel: GameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomChangedSocketEvent },
  })
  private _gameRoomChangedSocketEvent() {}
}
