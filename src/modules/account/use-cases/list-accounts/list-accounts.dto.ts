import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';

export class ListAccountsDto {
  @ApiProperty({
    type: String,
    enum: ['true'],
  })
  @IsIn([true])
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  })
  isActive: boolean;
}
