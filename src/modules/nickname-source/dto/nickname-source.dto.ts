import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class NicknameSourceDto extends BaseResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  sequence: number;

  @ApiProperty()
  fullname: string;
}
