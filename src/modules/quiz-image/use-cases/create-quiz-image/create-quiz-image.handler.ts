import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { CreateQuizImageCommand } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.command';

import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateQuizImageCommand)
export class CreateQuizImageHandler
  implements ICommandHandler<CreateQuizImageCommand, QuizImage>
{
  constructor(
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
    @Inject(AWS_S3_PORT)
    private readonly awsS3Adapter: AwsS3Port,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: CreateQuizImageCommand): Promise<QuizImage> {
    const quizImage = QuizImage.create({
      category: command.category,
      originalFileName: command.originalFileName,
      extension: command.extension,
      contentLength: command.contentLength,
      width: command.width,
      height: command.height,
    });

    await this.quizImageRepository.insert(quizImage);

    await this.eventStore.storeAggregateEvents(quizImage);

    await this.awsS3Adapter.uploadFile({
      file: command.buffer,
      key: quizImage.filePath,
      contentType: quizImage.contentType,
    });

    return quizImage;
  }
}
