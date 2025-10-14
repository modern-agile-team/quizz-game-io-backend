import { Module } from '@nestjs/common';

import { CreateQuizzesModule } from '@module/quiz/use-cases/create-quizzes/create-quizzes.module';
import { GetQuizzesModule } from '@module/quiz/use-cases/get-quizzes/get-quizzes.module';
import { ListQuizzesModule } from '@module/quiz/use-cases/list-quizzes/list-quizzes.module';
import { UpdateQuizModule } from '@module/quiz/use-cases/update-quiz/update-quiz.module';

@Module({
  imports: [
    CreateQuizzesModule,
    GetQuizzesModule,
    ListQuizzesModule,
    UpdateQuizModule,
  ],
})
export class QuizModule {}
