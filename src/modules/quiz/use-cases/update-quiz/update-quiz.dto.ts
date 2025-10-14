import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateQuizDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  question?: string | null;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}
