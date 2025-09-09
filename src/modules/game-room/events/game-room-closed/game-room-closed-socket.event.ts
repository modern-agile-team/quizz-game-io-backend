import { ApiProperty } from '@nestjs/swagger';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class GameRoomClosedSocketEventBody {
  @ApiProperty()
  gameRoomId: string;
}

export class GameRoomClosedSocketEvent extends BaseSocketEvent<GameRoomClosedSocketEventBody> {
  static readonly EVENT_NAME = 'game_room.closed';

  @ApiProperty({ example: GameRoomClosedSocketEvent.EVENT_NAME })
  readonly eventName: string = GameRoomClosedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: GameRoomClosedSocketEventBody })
  body: GameRoomClosedSocketEventBody;
}
