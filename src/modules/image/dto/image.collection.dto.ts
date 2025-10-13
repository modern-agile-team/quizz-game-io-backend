import { ApiProperty } from '@nestjs/swagger';

import { ImageDto } from '@module/image/dto/image.dto';

import { BaseOffsetPaginationResponseDto } from '@common/base/base.dto';

export class ImageCollectionDto extends BaseOffsetPaginationResponseDto<ImageDto> {
  @ApiProperty({
    type: [ImageDto],
  })
  data: ImageDto[];
}
