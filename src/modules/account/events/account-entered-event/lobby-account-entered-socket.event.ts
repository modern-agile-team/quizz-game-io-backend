import { ApiProperty } from '@nestjs/swagger';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class LobbyAccountEnteredSocketEventBodyAccount {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  enteredAt: Date;
}

class LobbyAccountEnteredSocketEventBody {
  @ApiProperty({
    type: LobbyAccountEnteredSocketEventBodyAccount,
  })
  account: LobbyAccountEnteredSocketEventBodyAccount;

  @ApiProperty()
  currentActiveAccountsCount: number;
}

export class LobbyAccountEnteredSocketEvent extends BaseSocketEvent<LobbyAccountEnteredSocketEventBody> {
  static readonly EVENT_NAME = 'lobby.account.entered';

  @ApiProperty({ example: LobbyAccountEnteredSocketEvent.EVENT_NAME })
  readonly eventName: string = LobbyAccountEnteredSocketEvent.EVENT_NAME;

  @ApiProperty({ type: LobbyAccountEnteredSocketEventBody })
  body: LobbyAccountEnteredSocketEventBody;
}
