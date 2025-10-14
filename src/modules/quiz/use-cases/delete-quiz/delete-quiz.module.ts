import { Module } from '@nestjs/common';

import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { DeleteQuizController } from '@module/quiz/use-cases/delete-quiz/delete-quiz.controller';
import { DeleteQuizHandler } from '@module/quiz/use-cases/delete-quiz/delete-quiz.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [QuizRepositoryModule, EventStoreModule],
  controllers: [DeleteQuizController],
  providers: [DeleteQuizHandler],
})
export class DeleteQuizModule {}
