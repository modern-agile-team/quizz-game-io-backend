import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { DeleteQuizCommand } from '@module/quiz/use-cases/delete-quiz/delete-quiz.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(DeleteQuizCommand)
export class DeleteQuizHandler
  implements ICommandHandler<DeleteQuizCommand, void>
{
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: DeleteQuizCommand): Promise<void> {
    const quiz = await this.quizRepository.findOneById(command.quizId);

    if (quiz === undefined) {
      throw new QuizNotFoundError();
    }

    quiz.delete();

    await this.quizRepository.delete(quiz);

    await this.eventStore.storeAggregateEvents(quiz);
  }
}
