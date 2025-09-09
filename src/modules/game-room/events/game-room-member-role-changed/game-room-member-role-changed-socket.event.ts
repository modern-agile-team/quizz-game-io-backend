import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class GameRoomMemberRoleChangedSocketEventBody {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  gameRoomId: string;

  @ApiProperty({
    title: 'GameRoomMemberRole',
    enum: GameRoomMemberRole,
    enumName: 'GameRoomMemberRole',
  })
  role: GameRoomMemberRole;

  @ApiProperty()
  nickname: string;
}

export class GameRoomMemberRoleChangedSocketEvent extends BaseSocketEvent<GameRoomMemberRoleChangedSocketEventBody> {
  static readonly EVENT_NAME = 'game_room.member_role_changed';

  @ApiProperty({ example: GameRoomMemberRoleChangedSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomMemberRoleChangedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomMemberRoleChangedSocketEventBody })
  body: GameRoomMemberRoleChangedSocketEventBody;
}
