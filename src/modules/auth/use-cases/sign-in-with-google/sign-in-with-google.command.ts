import { ICommand } from '@nestjs/cqrs';

export interface ISignInWithGoogleCommandProps {
  uid: string;
}

export class SignInWithGoogleCommand implements ICommand {
  readonly uid: string;

  constructor(props: ISignInWithGoogleCommandProps) {
    this.uid = props.uid;
  }
}
