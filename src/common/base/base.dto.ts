import { ApiProperty } from '@nestjs/swagger';

import { ISort } from '@common/base/base.repository';

export class SortDto implements ISort {
  field: string;

  direction: 'desc' | 'asc';
}

export class BaseResponseDto {
  constructor(props: BaseResponseDto) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export abstract class BaseCursorPaginationResponseDto<T> {
  @ApiProperty({
    nullable: true,
  })
  cursor: string | null;

  abstract data: T[];
}
