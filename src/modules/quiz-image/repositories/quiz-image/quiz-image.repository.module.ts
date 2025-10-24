import { Module } from '@nestjs/common';

import { QuizImageRepository } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository';
import { QUIZ_IMAGE_REPOSITORY } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';

@Module({
  providers: [
    {
      provide: QUIZ_IMAGE_REPOSITORY,
      useClass: QuizImageRepository,
    },
  ],
  exports: [QUIZ_IMAGE_REPOSITORY],
})
export class QuizImageRepositoryModule {}
