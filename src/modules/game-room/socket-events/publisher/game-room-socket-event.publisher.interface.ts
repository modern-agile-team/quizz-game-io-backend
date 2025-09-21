import {
  GameRoomChangedSocketEvent,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { LobbyGameRoomCreatedSocketEvent } from '@module/game-room/socket-events/game-room-created.socket-event';
import { LobbyGameRoomDeletedSocketEvent } from '@module/game-room/socket-events/game-room-deleted.socket-event';

export const GAME_ROOM_SOCKET_EVENT_PUBLISHER = Symbol(
  'GAME_ROOM_SOCKET_EVENT_PUBLISHER',
);

export type PublishableGameRoomSocketEvent =
  | GameRoomChangedSocketEvent
  | LobbyGameRoomChangedSocketEvent
  | LobbyGameRoomCreatedSocketEvent
  | LobbyGameRoomDeletedSocketEvent;

export interface IGameRoomSocketEventPublisher {
  publishToLobby(event: PublishableGameRoomSocketEvent): void;

  publishToGameRoom(event: PublishableGameRoomSocketEvent): void;

  joinAndPublishToGameRoom(
    accountId: string,
    event: PublishableGameRoomSocketEvent,
  ): Promise<void>;

  leaveAndPublishToGameRoom(
    accountId: string,
    event: PublishableGameRoomSocketEvent,
  ): Promise<void>;
}
