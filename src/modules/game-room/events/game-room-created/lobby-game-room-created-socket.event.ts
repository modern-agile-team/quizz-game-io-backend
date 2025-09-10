import { ApiProperty } from '@nestjs/swagger';

import {
  GameRoomStatus,
  GameRoomVisibility,
} from '@module/game-room/entities/game-room.entity';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class LobbyGameRoomCreatedSocketEventBody {
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

export class LobbyGameRoomCreatedSocketEvent extends BaseSocketEvent<LobbyGameRoomCreatedSocketEventBody> {
  static readonly EVENT_NAME = 'lobby.game_room.created';

  @ApiProperty({ example: LobbyGameRoomCreatedSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyGameRoomCreatedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: LobbyGameRoomCreatedSocketEventBody })
  body: LobbyGameRoomCreatedSocketEventBody;
}
