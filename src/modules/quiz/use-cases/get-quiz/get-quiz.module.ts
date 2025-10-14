import { Module } from '@nestjs/common';

import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { GetQuizController } from '@module/quiz/use-cases/get-quiz/get-quiz.controller';
import { GetQuizHandler } from '@module/quiz/use-cases/get-quiz/get-quiz.handler';

@Module({
  imports: [QuizRepositoryModule],
  controllers: [GetQuizController],
  providers: [GetQuizHandler],
})
export class GetQuizModule {}
