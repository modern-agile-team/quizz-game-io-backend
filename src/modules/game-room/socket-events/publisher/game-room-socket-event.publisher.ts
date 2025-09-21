import { Inject, Injectable } from '@nestjs/common';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import {
  GameRoomChangedSocketEvent,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { LobbyGameRoomCreatedSocketEvent } from '@module/game-room/socket-events/game-room-created.socket-event';
import { LobbyGameRoomDeletedSocketEvent } from '@module/game-room/socket-events/game-room-deleted.socket-event';
import {
  IGameRoomSocketEventPublisher,
  PublishableGameRoomSocketEvent,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

import { InternalServerError } from '@common/base/base.error';

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
export class GameRoomSocketEventPublisher
  implements IGameRoomSocketEventPublisher
{
  constructor(
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
    @Inject(SOCKET_SESSION_MANAGER)
    private readonly socketSessionManager: ISocketSessionManager,
  ) {}

  publishToLobby(event: PublishableGameRoomSocketEvent): void {
    this.assertLobbyEvent(event);

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, event);
  }

  publishToGameRoom(event: PublishableGameRoomSocketEvent): void {
    this.assertGameRoomEvent(event);

    const roomKey = this.getRoomKey(event);

    this.socketEmitter.emitToRoom(WS_NAMESPACE.ROOT, roomKey, event);
  }

  async joinAndPublishToGameRoom(
    accountId: string,
    event: PublishableGameRoomSocketEvent,
  ): Promise<void> {
    this.assertGameRoomEvent(event);

    const roomKey = this.getRoomKey(event);

    await this.socketSessionManager.remoteJoinByAccount(accountId, roomKey);

    this.publishToGameRoom(event);
  }

  async leaveAndPublishToGameRoom(
    accountId: string,
    event: PublishableGameRoomSocketEvent,
  ): Promise<void> {
    this.assertGameRoomEvent(event);

    const roomKey = this.getRoomKey(event);

    await this.socketSessionManager.remoteLeaveByAccount(accountId, roomKey);

    this.publishToGameRoom(event);
  }

  private getRoomKey(event: PublishableGameRoomSocketEvent): string {
    const { gameRoomId } = event.body;

    if (!gameRoomId) {
      throw new InternalServerError(
        'GameRoomSocketEventPublisher requires event.body.gameRoomId to publish.',
      );
    }

    return gameRoomKeyOf(gameRoomId);
  }

  private assertLobbyEvent(event: PublishableGameRoomSocketEvent): void {
    if (!event.eventName.startsWith('lobby.')) {
      throw new InternalServerError(
        `GameRoomSocketEventPublisher expected lobby event, received ${event.eventName}.`,
      );
    }
  }

  private assertGameRoomEvent(event: PublishableGameRoomSocketEvent): void {
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
  private _createdToDoc() {}

  @AsyncApiPub({
    operationId: LobbyGameRoomChangedSocketEvent.name,
    tags: [{ name: 'lobby' }],
    description: '게임방의 상태 변경',
    channel: LobbyGameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomChangedSocketEvent },
  })
  private _changedToLobbyDoc() {}

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임방이 폐쇄됨',
    channel: LobbyGameRoomDeletedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomDeletedSocketEvent },
  })
  private _deletedToLobbyDoc() {}

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '게임방의 상태 변경',
    channel: GameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomChangedSocketEvent },
  })
  private _changedToRoomDoc() {}
}
