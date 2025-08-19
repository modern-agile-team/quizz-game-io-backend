import { RoomMemberRole } from '@module/game-room/entities/room-member.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomMemberJoinedEventPayload {
  gameRoomId: string;
  accountId: string;
  role: RoomMemberRole;
}

export class GameRoomMemberJoinedEvent extends DomainEvent<GameRoomMemberJoinedEventPayload> {
  readonly aggregate = 'GameRoom';
}
