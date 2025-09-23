import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberDto } from '@module/game-room/dto/game-room-member.dto';
import { GameRoomStatus } from '@module/game-room/entities/game-room.entity';

import { BaseResponseDto } from '@common/base/base.dto';

export class GameRoomDto extends BaseResponseDto {
  @ApiProperty()
  hostId: string;

  @ApiProperty({ enum: GameRoomStatus })
  status: GameRoomStatus;

  @ApiProperty()
  title: string;

  @ApiProperty()
  maxMembersCount: number;

  @ApiProperty()
  currentMembersCount: number;

  @ApiProperty()
  quizTimeLimitInSeconds: number;

  @ApiProperty()
  quizzesCount: number;

  @ApiProperty({
    type: [GameRoomMemberDto],
  })
  members: GameRoomMemberDto[];
}
