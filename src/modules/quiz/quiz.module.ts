import { Module } from '@nestjs/common';

import { CreateQuizzesModule } from '@module/quiz/use-cases/create-quizzes/create-quizzes.module';
import { GetQuizModule } from '@module/quiz/use-cases/get-quiz/get-quiz.module';
import { ListQuizzesModule } from '@module/quiz/use-cases/list-quizzes/list-quizzes.module';
import { UpdateQuizModule } from '@module/quiz/use-cases/update-quiz/update-quiz.module';

@Module({
  imports: [
    CreateQuizzesModule,
    GetQuizModule,
    ListQuizzesModule,
    UpdateQuizModule,
  ],
})
export class QuizModule {}
