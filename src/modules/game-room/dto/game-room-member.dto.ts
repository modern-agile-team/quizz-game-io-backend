import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberRole } from '@module/game-room/entities/game-room-member.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class GameRoomMemberDto extends BaseResponseDto {
  @ApiProperty()
  accountId: string;

  @ApiProperty()
  gameRoomId: string;

  @ApiProperty({
    enum: GameRoomMemberRole,
  })
  role: GameRoomMemberRole;

  @ApiProperty({
    description: '게임방 구성원의 닉네임(계정 닉네임과 동일함)',
  })
  nickname: string;
}
