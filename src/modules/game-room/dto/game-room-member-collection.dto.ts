import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberDto } from '@module/game-room/dto/game-room-member.dto';

export class GameRoomMemberCollectionDto {
  @ApiProperty({
    type: [GameRoomMemberDto],
  })
  data: GameRoomMemberDto[];
}
