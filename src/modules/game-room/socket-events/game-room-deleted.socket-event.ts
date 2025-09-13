import { ApiProperty } from '@nestjs/swagger';

import { GameRoomIdentifierSocketEventDto } from '@module/game-room/dto/game-room-socket-event.dto';

import { BaseSocketEvent } from '@common/base/base-socket-event';

export enum GameRoomDeletedSocketEventAction {
  closed = 'closed',
}

export class LobbyGameRoomDeletedSocketEvent extends BaseSocketEvent<GameRoomIdentifierSocketEventDto> {
  static readonly EVENT_NAME = 'lobby.game_room.deleted';

  @ApiProperty({
    title: 'GameRoomDeletedSocketEventAction',
    enum: GameRoomDeletedSocketEventAction,
    enumName: 'GameRoomDeletedSocketEventAction',
  })
  action: GameRoomDeletedSocketEventAction;

  @ApiProperty({ example: LobbyGameRoomDeletedSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyGameRoomDeletedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomIdentifierSocketEventDto })
  body: GameRoomIdentifierSocketEventDto;
}
