import { Module } from '@nestjs/common';

import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { GetQuizzesController } from '@module/quiz/use-cases/get-quizzes/get-quizzes.controller';
import { GetQuizzesHandler } from '@module/quiz/use-cases/get-quizzes/get-quizzes.handler';

@Module({
  imports: [QuizRepositoryModule],
  controllers: [GetQuizzesController],
  providers: [GetQuizzesHandler],
})
export class GetQuizzesModule {}
