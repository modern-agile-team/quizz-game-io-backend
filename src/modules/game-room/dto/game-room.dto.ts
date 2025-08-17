import { ApiProperty } from '@nestjs/swagger';

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
  maxPlayersCount: number;
}
