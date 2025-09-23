import { LobbyAccountChangedSocketEvent } from '@module/account/socket-events/account-changed.socket-event';
import { LobbyActiveAccountChangedSocketEvent } from '@module/account/socket-events/active-account-changed.socket-event';
import {
  GameRoomChangedSocketEvent,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { LobbyGameRoomCreatedSocketEvent } from '@module/game-room/socket-events/game-room-created.socket-event';
import { LobbyGameRoomDeletedSocketEvent } from '@module/game-room/socket-events/game-room-deleted.socket-event';

export const SOCKET_EVENT_PUBLISHER = Symbol('SOCKET_EVENT_PUBLISHER');

export type PublishableSocketEvent =
  // Account
  | LobbyAccountChangedSocketEvent
  | LobbyActiveAccountChangedSocketEvent
  // GameRoom
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
