import { ApiProperty } from '@nestjs/swagger';

import { IsString, Length } from 'class-validator';

export class CreateNicknameSourceDto {
  @ApiProperty({
    minLength: 1,
    maxLength: 10,
  })
  @Length(1, 10)
  @IsString()
  name: string;
}
