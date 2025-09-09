import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomCreatedEventPayload {
  hostId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxPlayers: number;
  currentMembersCount: number;
}

export class GameRoomCreatedEvent extends DomainEvent<GameRoomCreatedEventPayload> {
  readonly aggregate = 'GameRoom';
}
