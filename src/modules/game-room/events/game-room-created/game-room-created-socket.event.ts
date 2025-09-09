import { ApiProperty } from '@nestjs/swagger';

import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class GameRoomCreatedSocketEventBody {
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
}

export class GameRoomCreatedSocketEvent extends BaseSocketEvent<GameRoomCreatedSocketEventBody> {
  static readonly EVENT_NAME = 'game_room.created';

  @ApiProperty({ example: GameRoomCreatedSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomCreatedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomCreatedSocketEventBody })
  body: GameRoomCreatedSocketEventBody;
}
