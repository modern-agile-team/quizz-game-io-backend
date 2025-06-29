import { AccountCreatedEvent } from '@module/account/events/account-created-event/account-created.event';

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
}

export interface AccountProps {
  role: AccountRole;
  signInType: SignInType;
  username?: string;
  password?: string;
}

interface CreateAccountProps {
  role: AccountRole;
  signInType: SignInType;
  username?: string;
  password?: string;
}

export class Account extends AggregateRoot<AccountProps> {
  constructor(props: CreateEntityProps<AccountProps>) {
    super(props);
  }

  static create(props: CreateAccountProps) {
    const id = generateEntityId();
    const date = new Date();

    const account = new Account({
      id,
      props: {
        role: props.role,
        signInType: props.signInType,
        username: props.username,
        password: props.password,
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

  get username(): string | undefined {
    return this.props.username;
  }
}
