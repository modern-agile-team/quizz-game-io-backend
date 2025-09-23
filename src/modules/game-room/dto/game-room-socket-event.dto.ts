import { ApiProperty } from '@nestjs/swagger';

import { GameRoomMemberSocketEventDto } from '@module/game-room/dto/game-room-member-socket-event.dto';
import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

export class GameRoomIdentifierSocketEventDto {
  @ApiProperty()
  gameRoomId: string;
}

export class GameRoomSocketEventDto {
  @ApiProperty()
  gameRoomId: string;

  @ApiProperty({
    title: 'GameRoomStatus',
    enum: GameRoomStatus,
    enumName: 'GameRoomStatus',
  })
  status: GameRoomStatus;

  @ApiProperty({
    title: 'GameRoomVisibility',
    enum: GameRoomVisibility,
    enumName: 'GameRoomVisibility',
  })
  visibility: GameRoomVisibility;

  @ApiProperty()
  title: string;

  @ApiProperty()
  maxPlayers: number;

  @ApiProperty()
  currentMembersCount: number;

  @ApiProperty()
  quizTimeLimitInSeconds: number;

  @ApiProperty({
    type: [GameRoomMemberSocketEventDto],
  })
  members: GameRoomMemberSocketEventDto[];

  @ApiProperty()
  quizzesCount: number;
}
