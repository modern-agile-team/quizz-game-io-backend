import { IQuery } from '@nestjs/cqrs';

import { SortDto } from '@common/base/base.dto';

export interface IListGameRoomsQueryProps {
  sort?: SortDto[];
}

export class ListGameRoomsQuery implements IQuery {
  readonly sort: SortDto[];

  constructor(props: IListGameRoomsQueryProps) {
    this.sort = props.sort ?? [{ field: 'createdAt', direction: 'asc' }];
  }
}
