import { Test, TestingModule } from '@nestjs/testing';

import { Image } from '@module/image/entities/image.entity';
import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { CreateImageCommandFactory } from '@module/image/use-cases/create-image/__spec__/create-image-command.factory';
import { CreateImageCommand } from '@module/image/use-cases/create-image/create-image.command';
import { CreateImageHandler } from '@module/image/use-cases/create-image/create-image.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { AppConfigService } from '@common/app-config/app-config.service';
import { ClaModuleFactory } from '@common/factories/cls-module.factory';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';
import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateImageHandler.name, () => {
  let handler: CreateImageHandler;

  let imageRepository: ImageRepositoryPort;
  let awsS3Adapter: AwsS3Port;
  let eventStore: IEventStore;
  let appConfigService: AppConfigService;

  let command: CreateImageCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ImageRepositoryModule,
        AwsS3Module,
        EventStoreModule,
        AppConfigModule,
        ClaModuleFactory(),
      ],
      providers: [CreateImageHandler],
    }).compile();

    handler = module.get<CreateImageHandler>(CreateImageHandler);

    imageRepository = module.get<ImageRepositoryPort>(IMAGE_REPOSITORY);
    awsS3Adapter = module.get<AwsS3Port>(AWS_S3_PORT);
    eventStore = module.get<IEventStore>(EVENT_STORE);
    appConfigService = module.get<AppConfigService>(AppConfigService);
  });

  beforeEach(() => {
    command = CreateImageCommandFactory.build();
  });

  beforeEach(() => {
    jest.spyOn(awsS3Adapter, 'uploadFile').mockResolvedValue(undefined);
  });

  describe('이미지를 업로드하는 경우', () => {
    it('이미지가 생성되어야 한다.', async () => {
      await expect(handler.execute(command)).resolves.toMatchObject<
        Partial<Image>
      >({
        category: command.category,
        extension: command.extension,
        contentLength: command.contentLength,
        width: command.width,
        height: command.height,
      });
    });
  });
});
