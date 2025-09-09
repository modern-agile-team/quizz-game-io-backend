import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomClosedEventPayload {
  gameRoomId: string;
}

export class GameRoomClosedEvent extends DomainEvent<GameRoomClosedEventPayload> {
  readonly aggregate = 'GameRoom';
}
