import { DomainEvent } from '@common/base/base.domain-event';

interface AccountEnteredEventPayload {
  enteredAt: Date;
}

export class AccountEnteredEvent extends DomainEvent<AccountEnteredEventPayload> {
  readonly aggregate = 'Account';
}
