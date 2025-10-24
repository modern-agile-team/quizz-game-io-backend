import { Module } from '@nestjs/common';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { UpdateQuizController } from '@module/quiz/use-cases/update-quiz/update-quiz.controller';
import { UpdateQuizHandler } from '@module/quiz/use-cases/update-quiz/update-quiz.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [QuizRepositoryModule, QuizImageRepositoryModule, EventStoreModule],
  controllers: [UpdateQuizController],
  providers: [UpdateQuizHandler],
})
export class UpdateQuizModule {}
