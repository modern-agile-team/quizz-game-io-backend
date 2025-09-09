import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomClosedSocketEvent } from '@module/game-room/events/game-room-closed/game-room-closed-socket.event';
import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';

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
    channel: GameRoomClosedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomClosedSocketEvent },
  })
  private publish(event: GameRoomClosedEvent): void {
    const socketEvent = new GameRoomClosedSocketEvent({
      gameRoomId: event.eventPayload.gameRoomId,
    });

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
