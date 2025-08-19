import { ApiProperty } from '@nestjs/swagger';

import { RoomMemberRole } from '@module/game-room/entities/room-member.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class RoomMemberDto extends BaseResponseDto {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  gameRoomId: string;

  @ApiProperty({
    enum: RoomMemberRole,
  })
  role: RoomMemberRole;
}
