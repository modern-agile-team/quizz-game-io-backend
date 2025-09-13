import { ApiProperty } from '@nestjs/swagger';

import { AccountSocketEventDto } from '@module/account/dto/account-socket-event.dto';

import { BaseSocketEvent } from '@common/base/base-socket-event';

export enum AccountChangedSocketEventAction {
  entered = 'entered',
}

export class LobbyAccountChangedSocketEvent extends BaseSocketEvent<AccountSocketEventDto> {
  static readonly EVENT_NAME = 'lobby.account.changed';

  @ApiProperty({
    title: 'AccountChangedSocketEventAction',
    enum: AccountChangedSocketEventAction,
    enumName: 'AccountChangedSocketEventAction',
  })
  action: AccountChangedSocketEventAction;

  @ApiProperty({ example: LobbyAccountChangedSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyAccountChangedSocketEvent.EVENT_NAME;

  @ApiProperty({ type: AccountSocketEventDto })
  body: AccountSocketEventDto;
}
