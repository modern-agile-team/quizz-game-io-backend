import { ApiProperty } from '@nestjs/swagger';

import { ISort } from '@common/base/base.repository';

export class SortDto<Field extends string = string> implements ISort<Field> {
  field: Field;

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

export abstract class BaseOffsetPaginationResponseDto<T> {
  abstract data: T[];

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;
}
