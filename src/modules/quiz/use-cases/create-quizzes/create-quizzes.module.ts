import { Module } from '@nestjs/common';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import { CreateQuizzesController } from '@module/quiz/use-cases/create-quizzes/create-quizzes.controller';
import { CreateQuizzesHandler } from '@module/quiz/use-cases/create-quizzes/create-quizzes.handler';

import { AssetModule } from '@shared/asset/asset.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    AssetModule.register({ category: 'quizImage' }),
    QuizRepositoryModule,
    QuizImageRepositoryModule,
    EventStoreModule,
  ],
  controllers: [CreateQuizzesController],
  providers: [CreateQuizzesHandler],
})
export class CreateQuizzesModule {}
