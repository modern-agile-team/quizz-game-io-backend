import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomCreatedEventPayload {
  hostAccountId: string;
  status: GameRoomStatus;
  visibility: GameRoomVisibility;
  title: string;
  maxPlayers: number;
  currentMembersCount: number;
  quizTimeLimitInSeconds: number;
}

export class GameRoomCreatedEvent extends DomainEvent<GameRoomCreatedEventPayload> {
  readonly aggregate = 'GameRoom';
}
