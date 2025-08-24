import { ICommand } from '@nestjs/cqrs';

import {
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';

export interface ICreateAccountCommandProps {
  role: AccountRole;
  signInType: SignInType;
  username: string;
  password: string;
  nickname?: string;
}

export class CreateAccountCommand implements ICommand {
  readonly role: AccountRole;
  readonly signInType: SignInType;
  readonly username: string;
  readonly password: string;
  readonly nickname?: string;

  constructor(props: ICreateAccountCommandProps) {
    this.role = props.role;
    this.signInType = props.signInType;
    this.username = props.username;
    this.password = props.password;
    this.nickname = props.nickname;
  }
}
