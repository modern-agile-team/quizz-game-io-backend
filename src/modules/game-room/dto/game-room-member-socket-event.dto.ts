import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

export class GameRoomMemberSocketEventDto {
  @ApiProperty()
  accountId: string;

  @ApiProperty({
    title: 'GameRoomMemberRole',
    enum: GameRoomMemberRole,
    enumName: 'GameRoomMemberRole',
  })
  role: GameRoomMemberRole;

  @ApiProperty()
  nickname: string;
}
