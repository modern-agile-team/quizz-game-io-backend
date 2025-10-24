import { Module } from '@nestjs/common';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { GetQuizImageController } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.controller';
import { GetQuizImageHandler } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.handler';

@Module({
  imports: [QuizImageRepositoryModule],
  controllers: [GetQuizImageController],
  providers: [GetQuizImageHandler],
})
export class GetQuizImageModule {}
