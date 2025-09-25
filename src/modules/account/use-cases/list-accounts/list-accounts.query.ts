import { IQuery } from '@nestjs/cqrs';

export interface IListAccountsQueryProps {
  isActive?: boolean;
}

export class ListAccountsQuery implements IQuery {
  readonly isActive?: boolean;

  constructor(props: IListAccountsQueryProps) {
    this.isActive = props.isActive;
  }
}
