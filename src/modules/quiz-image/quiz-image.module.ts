import { Module } from '@nestjs/common';

import { CreateQuizImageModule } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.module';
import { DeleteQuizImageModule } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.module';
import { GetQuizImageModule } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.module';
import { ListQuizImagesModule } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.module';

@Module({
  imports: [
    CreateQuizImageModule,
    DeleteQuizImageModule,
    GetQuizImageModule,
    ListQuizImagesModule,
  ],
})
export class QuizImageModule {}
