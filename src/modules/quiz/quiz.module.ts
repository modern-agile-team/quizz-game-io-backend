import { Module } from '@nestjs/common';

import { ListQuizzesModule } from '@module/quiz/use-cases/list-quizzes/list-quizzes.module';

@Module({
  imports: [ListQuizzesModule],
})
export class QuizModule {}
