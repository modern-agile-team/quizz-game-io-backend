import { ApiProperty } from '@nestjs/swagger';

import { GameRoomDto } from '@module/game-room/dto/game-room.dto';

export class GameRoomCollectionDto {
  @ApiProperty({
    type: [GameRoomDto],
  })
  data: GameRoomDto[];
}
