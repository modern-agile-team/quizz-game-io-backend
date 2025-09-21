import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomClosedEvent } from '@module/game-room/events/game-room-closed/game-room-closed.event';
import {
  GameRoomDeletedSocketEventAction,
  LobbyGameRoomDeletedSocketEvent,
} from '@module/game-room/socket-events/game-room-deleted.socket-event';
import {
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

@Injectable()
export class GameRoomClosedHandler {
  constructor(
    @Inject(GAME_ROOM_SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: IGameRoomSocketEventPublisher,
  ) {}

  @OnEvent(GameRoomClosedEvent.name)
  async handle(event: GameRoomClosedEvent): Promise<void> {
    const socketEvent = new LobbyGameRoomDeletedSocketEvent(
      GameRoomDeletedSocketEventAction.closed,
      {
        gameRoomId: event.aggregateId,
      },
    );

    this.eventPublisher.publishToLobby(socketEvent);
  }
}
