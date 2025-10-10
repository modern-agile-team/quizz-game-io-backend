import { Module } from '@nestjs/common';

import { QuizRepository } from '@module/quiz/repositories/quiz/quiz.repository';
import { QUIZ_REPOSITORY } from '@module/quiz/repositories/quiz/quiz.repository.port';

@Module({
  providers: [
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
  ],
  exports: [QUIZ_REPOSITORY],
})
export class QuizRepositoryModule {}
