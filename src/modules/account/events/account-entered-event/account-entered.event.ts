import { DomainEvent } from '@common/base/base.domain-event';

interface AccountEnteredEventPayload {
  nickname: string;
  enteredAt: Date;
}

export class AccountEnteredEvent extends DomainEvent<AccountEnteredEventPayload> {
  readonly aggregate = 'Account';
}
