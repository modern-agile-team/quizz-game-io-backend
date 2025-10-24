import { Module } from '@nestjs/common';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { UpdateQuizImageController } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.controller';
import { UpdateQuizImageHandler } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [QuizImageRepositoryModule, EventStoreModule],
  controllers: [UpdateQuizImageController],
  providers: [UpdateQuizImageHandler],
})
export class UpdateQuizImageModule {}
