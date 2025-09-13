import { IQuery } from '@nestjs/cqrs';

export interface IGetAccountQueryProps {
  accountId: string;
}

export class GetAccountQuery implements IQuery {
  readonly accountId: string;

  constructor(props: IGetAccountQueryProps) {
    this.accountId = props.accountId;
  }
}
