import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { Image } from '@module/image/entities/image.entity';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { CreateImageCommand } from '@module/image/use-cases/create-image/create-image.command';

import { AppConfigService } from '@common/app-config/app-config.service';

import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateImageCommand)
export class CreateImageHandler
  implements ICommandHandler<CreateImageCommand, Image>
{
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepositoryPort,
    @Inject(AWS_S3_PORT)
    private readonly awsS3Adapter: AwsS3Port,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Transactional()
  async execute(command: CreateImageCommand): Promise<Image> {
    const image = Image.create({
      category: command.category,
      originalFileName: command.originalFileName,
      extension: command.extension,
      contentLength: command.contentLength,
      width: command.width,
      height: command.height,
    });

    await this.imageRepository.insert(image);

    await this.eventStore.storeAggregateEvents(image);

    await this.awsS3Adapter.uploadFile({
      file: command.buffer,
      key: image.filePath,
      contentType: image.contentType,
    });

    return image;
  }
}
