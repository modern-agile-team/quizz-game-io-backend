import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListNicknameSourcesDto {
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
