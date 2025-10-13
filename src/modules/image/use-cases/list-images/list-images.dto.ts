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

export class ListImagesDto {
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
}
