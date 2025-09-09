import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface GameRoomMemberLeftEventPayload {
  gameRoomId: string;
  accountId: string;
  memberId: string;
  role: GameRoomMemberRole;
  nickname: string;
}

export class GameRoomMemberLeftEvent extends DomainEvent<GameRoomMemberLeftEventPayload> {
  readonly aggregate = 'GameRoom';
}
