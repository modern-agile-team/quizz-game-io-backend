import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

import { IsNullable } from '@common/validators/is-nullable.validator';

export class CreateQuizzesDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  answer: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsNullable()
  question: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsNullable()
  imageUrl: string | null;
}
