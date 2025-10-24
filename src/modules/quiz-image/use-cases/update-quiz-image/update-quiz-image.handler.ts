import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { UpdateQuizImageCommand } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(UpdateQuizImageCommand)
export class UpdateQuizImageHandler
  implements ICommandHandler<UpdateQuizImageCommand, QuizImage>
{
  constructor(
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: UpdateQuizImageCommand): Promise<QuizImage> {
    const quizImage = await this.quizImageRepository.findOneById(
      command.quizImageId,
    );

    if (quizImage === undefined) {
      throw new QuizImageNotFoundError();
    }

    quizImage.update({
      name: command.name,
      category: command.category,
    });

    await this.quizImageRepository.update(quizImage);

    await this.eventStore.storeAggregateEvents(quizImage);

    return quizImage;
  }
}
