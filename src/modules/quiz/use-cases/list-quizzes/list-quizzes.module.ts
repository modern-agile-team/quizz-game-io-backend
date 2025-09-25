import { Module } from '@nestjs/common';

import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { ListQuizzesController } from '@module/quiz/use-cases/list-quizzes/list-quizzes.controller';
import { ListQuizzesHandler } from '@module/quiz/use-cases/list-quizzes/list-quizzes.handler';

import { AdminGuard } from '@common/guards/admin.guard';

@Module({
  imports: [QuizRepositoryModule],
  controllers: [ListQuizzesController],
  providers: [ListQuizzesHandler, AdminGuard],
})
export class ListQuizzesModule {}
