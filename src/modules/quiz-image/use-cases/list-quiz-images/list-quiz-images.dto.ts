import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { SortDto } from '@common/base/base.dto';
import { ApiSort } from '@common/decorator/api-sort.decorator';
import { ParseSort } from '@common/transformer/parse-sort.transformer';

type AllowSortFields = 'createdAt' | 'updatedAt' | 'name' | 'category';

const ALLOW_SORT_FIELDS: ReadonlySet<AllowSortFields> = new Set([
  'createdAt',
  'updatedAt',
  'name',
  'category',
]);

export class ListQuizImagesDto {
  @ApiProperty({
    description: '카테고리 필터링',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    required: false,
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    required: false,
    minimum: 5,
    maximum: 1000,
    default: 20,
  })
  @Max(1000)
  @Min(5)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  perPage?: number;

  @ApiSort({
    allowFields: ALLOW_SORT_FIELDS,
  })
  @ParseSort(ALLOW_SORT_FIELDS)
  @IsOptional()
  sort?: SortDto<AllowSortFields>[];
}
