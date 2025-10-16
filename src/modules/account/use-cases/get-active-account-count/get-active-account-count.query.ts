import { IQuery } from '@nestjs/cqrs';

export interface IGetActiveAccountCountQueryProps {}

export class GetActiveAccountCountQuery implements IQuery {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(props: IGetActiveAccountCountQueryProps) {}
}
