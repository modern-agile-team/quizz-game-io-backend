import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '@common/base/base.dto';

export class QuizDto extends BaseResponseDto {
  constructor(props: BaseResponseDto) {
    super(props);
  }

  @ApiProperty({
    description: '퀴즈 유형',
    example: 'multipleChoice',
  })
  type: string;

  @ApiProperty({
    type: String,
    description: '퀴즈 질문',
    nullable: true,
    example: '다음 중 옳은 것은?',
  })
  question: string | null;

  @ApiProperty({
    description: '퀴즈 정답',
    example: '정답',
  })
  answer: string;

  @ApiProperty({
    type: String,
    description: '퀴즈 이미지 URL',
    nullable: true,
    example: 'https://example.com/quiz.png',
  })
  imageUrl: string | null;
}
