import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomCreatedSocketEvent } from '@module/game-room/events/game-room-created/game-room-created-socket.event';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';

@AsyncApi()
export class GameRoomCreatedHandler {
  constructor(
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(GameRoomCreatedEvent.name)
  async handle(event: GameRoomCreatedEvent): Promise<void> {
    this.publish(event);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '게임방이 생성됨',
    channel: GameRoomCreatedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomCreatedSocketEvent },
  })
  private publish(event: GameRoomCreatedEvent): void {
    const socketEvent = new GameRoomCreatedSocketEvent({
      gameRoomId: event.aggregateId,
      status: event.eventPayload.status,
      visibility: event.eventPayload.visibility,
      title: event.eventPayload.title,
      maxPlayers: event.eventPayload.maxPlayers,
      currentMembersCount: event.eventPayload.currentMembersCount,
    });

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
