import { ApiProperty } from '@nestjs/swagger';

import { QuizDto } from '@module/quiz/dto/quiz.dto';

export class QuizCollectionDto {
  @ApiProperty({
    type: [QuizDto],
  })
  data: QuizDto[];
}
