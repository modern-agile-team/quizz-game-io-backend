import { IsOptional } from 'class-validator';

import { SortDto } from '@common/base/base.dto';
import { ApiSort } from '@common/decorator/api-sort.decorator';
import { ParseSort } from '@common/transformer/parse-sort.transformer';

const ALLOW_SORT_FIELDS: ReadonlySet<string> = new Set(['createdAt']);

export class ListGameRoomsDto {
  @ApiSort({
    allowFields: ALLOW_SORT_FIELDS,
  })
  @ParseSort(ALLOW_SORT_FIELDS)
  @IsOptional()
  sort?: SortDto[];
}
