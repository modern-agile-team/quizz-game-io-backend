import { DomainEvent } from '@common/base/base.domain-event';

interface AccountSignedInEventPayload {
  signedInAt: Date;
}

export class AccountSignedInEvent extends DomainEvent<AccountSignedInEventPayload> {
  readonly aggregate = 'Account';
}
