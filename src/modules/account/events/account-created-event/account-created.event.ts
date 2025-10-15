import {
  AccountRole,
  SignInType,
  SocialProvider,
} from '@module/account/entities/account.entity';

import { DomainEvent } from '@common/base/base.domain-event';

interface AccountCreatedEventPayload {
  role: AccountRole;
  signInType: SignInType;
  socialProvider?: SocialProvider;
  socialProviderUid?: string;
  username?: string;
  password?: string;
  nickname: string;
}

export class AccountCreatedEvent extends DomainEvent<AccountCreatedEventPayload> {
  readonly aggregate = 'Account';
}
