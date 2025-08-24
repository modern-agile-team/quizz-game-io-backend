import { ApiProperty } from '@nestjs/swagger';

import { BaseSocketEvent } from '@common/base/base-socket-event';

class AccountEnteredSocketEventBodyAccount {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  enteredAt: Date;
}

class AccountEnteredSocketEventBody {
  @ApiProperty({
    type: AccountEnteredSocketEventBodyAccount,
  })
  account: AccountEnteredSocketEventBodyAccount;

  @ApiProperty()
  currentActiveAccountsCount: number;
}

export class AccountEnteredSocketEvent extends BaseSocketEvent<AccountEnteredSocketEventBody> {
  static readonly EVENT_NAME = 'account.entered';

  @ApiProperty({ example: AccountEnteredSocketEvent.EVENT_NAME })
  readonly eventName: string = AccountEnteredSocketEvent.EVENT_NAME;

  @ApiProperty({ type: AccountEnteredSocketEventBody })
  body: AccountEnteredSocketEventBody;
}
