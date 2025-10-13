import { Module } from '@nestjs/common';

import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { CreateQuizzesController } from '@module/quiz/use-cases/create-quizzes/create-quizzes.controller';
import { CreateQuizzesHandler } from '@module/quiz/use-cases/create-quizzes/create-quizzes.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [QuizRepositoryModule, ImageRepositoryModule, EventStoreModule],
  controllers: [CreateQuizzesController],
  providers: [CreateQuizzesHandler],
})
export class CreateQuizzesModule {}
