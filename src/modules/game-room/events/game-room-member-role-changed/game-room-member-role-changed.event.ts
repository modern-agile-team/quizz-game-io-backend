import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomMemberRoleChangedEventPayload {
  gameRoomId: string;
  accountId: string;
  memberId: string;
  role: GameRoomMemberRole;
  nickname: string;
}

export class GameRoomMemberRoleChangedEvent extends DomainEvent<GameRoomMemberRoleChangedEventPayload> {
  readonly aggregate = 'GameRoom';
}
