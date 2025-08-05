import { ICommand } from '@nestjs/cqrs';

export interface IEnterAccountCommandProps {
  accountId: string;
}

export class EnterAccountCommand implements ICommand {
  readonly accountId: string;

  constructor(props: IEnterAccountCommandProps) {
    this.accountId = props.accountId;
  }
}
