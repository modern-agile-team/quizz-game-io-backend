import { IQuery } from '@nestjs/cqrs';

export interface IListQuizzesQueryProps {}

export class ListQuizzesQuery implements IQuery {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(props: IListQuizzesQueryProps) {}
}
