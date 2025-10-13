import { Module } from '@nestjs/common';

import { CreateQuizzesModule } from '@module/quiz/use-cases/create-quizzes/create-quizzes.module';
import { ListQuizzesModule } from '@module/quiz/use-cases/list-quizzes/list-quizzes.module';

@Module({
  imports: [CreateQuizzesModule, ListQuizzesModule],
})
export class QuizModule {}
