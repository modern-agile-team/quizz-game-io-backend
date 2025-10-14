import { ApiProperty } from '@nestjs/swagger';

import { NicknameSourceDto } from '@module/nickname-source/dto/nickname-source.dto';

import { BaseOffsetPaginationResponseDto } from '@common/base/base.dto';

export class NicknameSourceCollectionDto extends BaseOffsetPaginationResponseDto<NicknameSourceDto> {
  @ApiProperty({
    type: [NicknameSourceDto],
  })
  data: NicknameSourceDto[];
}
