import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { QuizImageInUsedError } from '@module/quiz-image/errors/quiz-image-in-used.error';
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { DeleteQuizImageCommand } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.command';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';

import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(DeleteQuizImageCommand)
export class DeleteQuizImageHandler
  implements ICommandHandler<DeleteQuizImageCommand, void>
{
  constructor(
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
    @Inject(AWS_S3_PORT)
    private readonly awsS3Adapter: AwsS3Port,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: DeleteQuizImageCommand): Promise<void> {
    const existingQuizImage = await this.quizImageRepository.findOneById(
      command.quizImageId,
    );

    if (existingQuizImage === undefined) {
      throw new QuizImageNotFoundError();
    }

    const quizzesUsingImage = await this.quizRepository.findManyByFileNames(
      new Set([existingQuizImage.fileName]),
    );

    if (quizzesUsingImage.length > 0) {
      throw new QuizImageInUsedError();
    }

    existingQuizImage.delete();

    await this.quizImageRepository.delete(existingQuizImage);
    await this.eventStore.storeAggregateEvents(existingQuizImage);

    await this.awsS3Adapter.deleteFile({
      type: 'quizImage',
      fileName: existingQuizImage.fileName,
    });
  }
}
