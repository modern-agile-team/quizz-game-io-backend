import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { ImageNotFoundError } from '@module/image/errors/image-not-found.error';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { DeleteImageCommand } from '@module/image/use-cases/delete-image/delete-image.command';

import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(DeleteImageCommand)
export class DeleteImageHandler
  implements ICommandHandler<DeleteImageCommand, void>
{
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepositoryPort,
    @Inject(AWS_S3_PORT)
    private readonly awsS3Adapter: AwsS3Port,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: DeleteImageCommand): Promise<void> {
    const existingImage = await this.imageRepository.findOneById(
      command.imageId,
    );

    if (existingImage === undefined) {
      throw new ImageNotFoundError();
    }

    existingImage.delete();

    await this.imageRepository.delete(existingImage);
    await this.eventStore.storeAggregateEvents(existingImage);

    await this.awsS3Adapter.deleteFile(existingImage.filePath);
  }
}
