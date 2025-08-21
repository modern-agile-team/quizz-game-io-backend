import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomMemberJoinedEventPayload {
  gameRoomId: string;
  accountId: string;
  role: GameRoomMemberRole;
}

export class GameRoomMemberJoinedEvent extends DomainEvent<GameRoomMemberJoinedEventPayload> {
  readonly aggregate = 'GameRoom';
}
