import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQuizImageDto {
  @ApiProperty({
    required: false,
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
}
