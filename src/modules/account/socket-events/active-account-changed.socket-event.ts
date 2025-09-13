import { ApiProperty } from '@nestjs/swagger';

import { ActiveAccountSocketEventDto } from '@module/account/dto/active-account-socket-event.dto';

import { BaseSocketEvent } from '@common/base/base-socket-event';

export enum ActiveAccountChangedSocketEventAction {
  incr = 'incr',
}

export class LobbyActiveAccountChangedSocketEvent extends BaseSocketEvent<ActiveAccountSocketEventDto> {
  static readonly EVENT_NAME = 'lobby.active_account.changed';

  @ApiProperty({
    title: 'ActiveAccountChangedSocketEventAction',
    enum: ActiveAccountChangedSocketEventAction,
    enumName: 'ActiveAccountChangedSocketEventAction',
  })
  action: ActiveAccountChangedSocketEventAction;

  @ApiProperty({ example: LobbyActiveAccountChangedSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyActiveAccountChangedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: ActiveAccountSocketEventDto })
  body: ActiveAccountSocketEventDto;
}
