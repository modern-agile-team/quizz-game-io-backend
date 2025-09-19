import { GameRoomStatus } from '@module/game-room/entities/game-room.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomStartingEventPayload {
  gameRoomId: string;
  status: GameRoomStatus;
}

export class GameRoomStartingEvent extends DomainEvent<GameRoomStartingEventPayload> {
  readonly aggregate = 'GameRoom';
}
