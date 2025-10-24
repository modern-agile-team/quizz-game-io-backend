import { Module } from '@nestjs/common';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { ListQuizImagesController } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.controller';
import { ListQuizImagesHandler } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.handler';

@Module({
  imports: [QuizImageRepositoryModule],
  controllers: [ListQuizImagesController],
  providers: [ListQuizImagesHandler],
})
export class ListQuizImagesModule {}
