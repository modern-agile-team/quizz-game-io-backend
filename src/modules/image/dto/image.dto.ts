import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class ImageDto extends BaseResponseDto {
  @ApiProperty()
  category: string;

  @ApiProperty()
  originalFileName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  extension: string;

  @ApiProperty()
  contentType: string;

  @ApiProperty()
  contentLength: number;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;
}
