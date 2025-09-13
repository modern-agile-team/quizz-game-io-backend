import { ApiProperty } from '@nestjs/swagger';

import { GameRoomSocketEventDto } from '@module/game-room/dto/game-room-socket-event.dto';

import { BaseSocketEvent } from '@common/base/base-socket-event';

export enum GameRoomCreatedSocketEventAction {
  created = 'created',
}

export class LobbyGameRoomCreatedSocketEvent extends BaseSocketEvent<GameRoomSocketEventDto> {
  static readonly EVENT_NAME = 'lobby.game_room.created';

  @ApiProperty({
    title: 'GameRoomCreatedSocketEventAction',
    enum: GameRoomCreatedSocketEventAction,
    enumName: 'GameRoomCreatedSocketEventAction',
  })
  action: GameRoomCreatedSocketEventAction;

  @ApiProperty({ example: LobbyGameRoomCreatedSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyGameRoomCreatedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomSocketEventDto })
  body: GameRoomSocketEventDto;
}
