import { AccountCreatedEvent } from '@module/account/events/account-created-event/account-created.event';
import { AccountEnteredEvent } from '@module/account/events/account-entered-event/account-entered.event';
import { AccountSignedInEvent } from '@module/account/events/account-signed-in-event/account-signed-in.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum AccountRole {
  admin = 'admin',
  user = 'user',
}

export enum SignInType {
  username = 'username',
  google = 'google',
}

export enum SocialProvider {
  google = 'google',
}

export interface AccountProps {
  role: AccountRole;
  signInType: SignInType;
  socialProvider?: SocialProvider;
  socialProviderUid?: string;
  username?: string;
  password?: string;
  nickname: string;
  enteredAt?: Date;
  leftAt?: Date;
  isActive: boolean;
  lastSignedInAt?: Date;
}

interface CreateAccountWithUsernameProps {
  role: AccountRole;
  signInType: SignInType;
  nickname: string;
  username?: string;
  password?: string;
}

interface CreateAccountWithGoogleProps {
  role: AccountRole;
  socialProviderUid?: string;
  nickname: string;
}

export class Account extends AggregateRoot<AccountProps> {
  constructor(props: CreateEntityProps<AccountProps>) {
    super(props);
  }

  static createWithUsername(props: CreateAccountWithUsernameProps) {
    const id = generateEntityId();
    const date = new Date();

    const account = new Account({
      id,
      props: {
        role: props.role,
        signInType: props.signInType,
        username: props.username,
        password: props.password,
        nickname: props.nickname,
        isActive: false,
      },
      createdAt: date,
      updatedAt: date,
    });

    account.apply(
      new AccountCreatedEvent(account.id, {
        role: props.role,
        signInType: props.signInType,
        username: props.username,
        password: props.password,
        nickname: account.props.nickname,
      }),
    );

    return account;
  }

  static createAccountWithGoogle(props: CreateAccountWithGoogleProps) {
    const id = generateEntityId();
    const date = new Date();

    const account = new Account({
      id,
      props: {
        role: props.role,
        signInType: SignInType.google,
        socialProvider: SocialProvider.google,
        socialProviderUid: props.socialProviderUid,
        nickname: props.nickname,
        isActive: false,
      },
      createdAt: date,
      updatedAt: date,
    });

    account.apply(
      new AccountCreatedEvent(account.id, {
        role: AccountRole.user,
        signInType: SignInType.google,
        socialProvider: SocialProvider.google,
        socialProviderUid: props.socialProviderUid,
        nickname: account.props.nickname,
      }),
    );

    return account;
  }

  public validate(): void {}

  get role(): AccountRole {
    return this.props.role;
  }

  get signInType(): SignInType {
    return this.props.signInType;
  }

  get socialProvider(): SocialProvider | undefined {
    return this.props.socialProvider;
  }

  get socialProviderUid(): string | undefined {
    return this.props.socialProviderUid;
  }

  get username(): string | undefined {
    return this.props.username;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get nickname(): string {
    return this.props.nickname;
  }

  get enteredAt(): Date | undefined {
    return this.props.enteredAt;
  }

  get leftAt(): Date | undefined {
    return this.props.leftAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  enter() {
    const now = new Date();

    this.props.enteredAt = now;
    this.props.isActive = true;

    this.updatedAt = now;

    this.apply(
      new AccountEnteredEvent(this.id, {
        nickname: this.props.nickname,
        enteredAt: now,
      }),
    );
  }

  signIn() {
    const now = new Date();

    this.props.lastSignedInAt = now;

    this.updatedAt = now;

    this.apply(new AccountSignedInEvent(this.id, { signedInAt: now }));
  }
}
