import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import { LobbyGameRoomClosedSocketEvent } from '@module/game-room/events/game-room-closed/lobby-game-room-closed-socket.event';

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
    this.publish(event);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '게임방이 폐쇄됨',
    channel: LobbyGameRoomClosedSocketEvent.EVENT_NAME,
    message: { payload: LobbyGameRoomClosedSocketEvent },
  })
  private publish(event: GameRoomClosedEvent): void {
    const socketEvent = new LobbyGameRoomClosedSocketEvent({
      gameRoomId: event.eventPayload.gameRoomId,
    });

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
