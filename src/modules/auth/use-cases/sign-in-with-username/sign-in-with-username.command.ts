import { ICommand } from '@nestjs/cqrs';

export interface ISignInWithUsernameCommandProps {
  username: string;
  password: string;
}

export class SignInWithUsernameCommand implements ICommand {
  readonly username: string;
  readonly password: string;

  constructor(props: ISignInWithUsernameCommandProps) {
    this.username = props.username;
    this.password = props.password;
  }
}
