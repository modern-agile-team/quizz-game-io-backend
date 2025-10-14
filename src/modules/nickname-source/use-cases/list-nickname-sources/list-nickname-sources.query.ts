import { IQuery } from '@nestjs/cqrs';

export interface IListNicknameSourcesQueryProps {
  page?: number;
  perPage?: number;
}

export class ListNicknameSourcesQuery implements IQuery {
  readonly page?: number;
  readonly perPage?: number;

  constructor(props: IListNicknameSourcesQueryProps) {
    this.page = props.page;
    this.perPage = props.perPage;
  }
}
