import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import {
  GameRoomDeletedSocketEventAction,
  LobbyGameRoomDeletedSocketEvent,
} from '@module/game-room/socket-events/game-room-deleted.socket-event';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';

@AsyncApi()
export class GameRoomClosedHandler {
  constructor(
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(GameRoomClosedEvent.name)
  async handle(event: GameRoomClosedEvent): Promise<void> {
    this.publish(event.eventPayload.gameRoomId);
  }

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '게임방이 폐쇄됨',
    channel: LobbyGameRoomDeletedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomDeletedSocketEvent },
  })
  private publish(gameRoomId: string): void {
    const socketEvent = new LobbyGameRoomDeletedSocketEvent(
      GameRoomDeletedSocketEventAction.closed,
      {
        gameRoomId,
      },
    );

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
