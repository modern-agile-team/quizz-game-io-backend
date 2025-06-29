import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class SignUpWithUsernameDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
