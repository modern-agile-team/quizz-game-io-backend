import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizImageNotFoundError } from '@module/quiz/errors/quiz-image-not-found.error';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { UpdateQuizCommand } from '@module/quiz/use-cases/update-quiz/update-quiz.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(UpdateQuizCommand)
export class UpdateQuizHandler
  implements ICommandHandler<UpdateQuizCommand, Quiz>
{
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: UpdateQuizCommand): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneById(command.quizId);

    if (quiz === undefined) {
      throw new QuizNotFoundError();
    }

    if (command.imageFileName) {
      const quizImages = await this.quizImageRepository.findByFileNames([
        command.imageFileName,
      ]);

      if (quizImages.length === 0) {
        throw new QuizImageNotFoundError();
      }
    }

    quiz.update({
      type: command.type,
      question: command.question,
      answer: command.answer,
      imageFileName: command.imageFileName,
    });

    await this.quizRepository.update(quiz);

    await this.eventStore.storeAggregateEvents(quiz);

    return quiz;
  }
}
