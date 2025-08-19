import { ApiProperty } from '@nestjs/swagger';

import { RoomMemberRole } from '@module/game-room/entities/room-member.entity';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class GameRoomMemberJoinedSocketEventBody {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  gameRoomId: string;

  @ApiProperty({
    enum: RoomMemberRole,
  })
  role: RoomMemberRole;

  @ApiProperty()
  currentMembersCount: number;
}

export class GameRoomMemberJoinedSocketEvent extends BaseSocketEvent<GameRoomMemberJoinedSocketEventBody> {
  static readonly EVENT_NAME = 'game_room.member_joined';

  @ApiProperty({ example: GameRoomMemberJoinedSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomMemberJoinedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomMemberJoinedSocketEventBody })
  body: GameRoomMemberJoinedSocketEventBody;
}
