import {
  GameRoomChangedSocketEvent,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { LobbyGameRoomCreatedSocketEvent } from '@module/game-room/socket-events/game-room-created.socket-event';
import { LobbyGameRoomDeletedSocketEvent } from '@module/game-room/socket-events/game-room-deleted.socket-event';

export const SOCKET_EVENT_PUBLISHER = Symbol('SOCKET_EVENT_PUBLISHER');

export type PublishableSocketEvent =
  | GameRoomChangedSocketEvent
  | LobbyGameRoomChangedSocketEvent
  | LobbyGameRoomCreatedSocketEvent
  | LobbyGameRoomDeletedSocketEvent;

export interface ISocketEventPublisher {
  publishToLobby(event: PublishableSocketEvent): void;

  publishToGameRoom(gameRoomId: string, event: PublishableSocketEvent): void;

  joinAndPublishToGameRoom(
    accountId: string,
    gameRoomId: string,
    event: PublishableSocketEvent,
  ): Promise<void>;

  leaveAndPublishToGameRoom(
    accountId: string,
    gameRoomId: string,
    event: PublishableSocketEvent,
  ): Promise<void>;
}
