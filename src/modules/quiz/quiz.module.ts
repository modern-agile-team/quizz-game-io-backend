import { Module } from '@nestjs/common';

import { CreateQuizzesModule } from '@module/quiz/use-cases/create-quizzes/create-quizzes.module';
import { GetQuizzesModule } from '@module/quiz/use-cases/get-quizzes/get-quizzes.module';
import { ListQuizzesModule } from '@module/quiz/use-cases/list-quizzes/list-quizzes.module';

@Module({
  imports: [CreateQuizzesModule, GetQuizzesModule, ListQuizzesModule],
})
export class QuizModule {}
