import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateNicknameSourceDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 10,
    required: false,
  })
  @Length(1, 10)
  @IsString()
  @IsOptional()
  name?: string;
}
