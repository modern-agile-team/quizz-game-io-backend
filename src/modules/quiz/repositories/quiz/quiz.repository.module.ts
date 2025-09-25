import { Module } from '@nestjs/common';

import { QuizRepository } from '@module/quiz/repositories/quiz/quiz.repository';
import { QUIZ_REPOSITORY } from '@module/quiz/repositories/quiz/quiz.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
  ],
  exports: [QUIZ_REPOSITORY],
})
export class QuizRepositoryModule {}
