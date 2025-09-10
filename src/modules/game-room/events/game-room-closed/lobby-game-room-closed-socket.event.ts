import { ApiProperty } from '@nestjs/swagger';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class LobbyGameRoomClosedSocketEventBody {
  @ApiProperty()
  gameRoomId: string;
}

export class LobbyGameRoomClosedSocketEvent extends BaseSocketEvent<LobbyGameRoomClosedSocketEventBody> {
  static readonly EVENT_NAME = 'lobby.game_room.closed';

  @ApiProperty({ example: LobbyGameRoomClosedSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyGameRoomClosedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: LobbyGameRoomClosedSocketEventBody })
  body: LobbyGameRoomClosedSocketEventBody;
}
