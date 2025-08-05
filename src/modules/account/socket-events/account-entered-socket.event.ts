import { BaseSocketEvent } from '@common/base/base-socket-event';

type AccountEnteredSocketEventPayload = {
  account: {
    id: string;
    enteredAt: Date;
  };
  currentActiveAccountsCount: number;
};

export class AccountEnteredSocketEvent extends BaseSocketEvent<AccountEnteredSocketEventPayload> {
  readonly eventName = 'account.entered';
}
