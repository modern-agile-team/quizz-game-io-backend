import { ApiProperty } from '@nestjs/swagger/dist/decorators';

import { GameRoomSocketEventDto } from '@module/game-room/dto/game-room-socket-event.dto';

import { BaseSocketEvent } from '@common/base/base-socket-event';

export enum GameRoomChangedSocketEventAction {
  member_joined = 'member_joined',
  member_left = 'member_left',
  member_role_changed = 'member_role_changed',
}

export class GameRoomChangedSocketEvent extends BaseSocketEvent<GameRoomSocketEventDto> {
  static readonly EVENT_NAME = 'game_room.game_room.changed';

  @ApiProperty({
    title: 'GameRoomChangedSocketEventAction',
    enum: GameRoomChangedSocketEventAction,
    enumName: 'GameRoomChangedSocketEventAction',
  })
  action: GameRoomChangedSocketEventAction;

  @ApiProperty({ example: GameRoomChangedSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomChangedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomSocketEventDto })
  body: GameRoomSocketEventDto;
}
