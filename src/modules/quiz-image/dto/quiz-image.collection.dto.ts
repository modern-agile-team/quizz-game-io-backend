import { ApiProperty } from '@nestjs/swagger';

import { QuizImageDto } from '@module/quiz-image/dto/quiz-image.dto';

import { BaseOffsetPaginationResponseDto } from '@common/base/base.dto';

export class QuizImageCollectionDto extends BaseOffsetPaginationResponseDto<QuizImageDto> {
  @ApiProperty({
    type: [QuizImageDto],
  })
  data: QuizImageDto[];
}
