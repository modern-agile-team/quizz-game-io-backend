import { Test, TestingModule } from '@nestjs/testing';

import { ImageFactory } from '@module/image/entities/__spec__/image.factory';
import { Image } from '@module/image/entities/image.entity';
import { ImageNotFoundError } from '@module/image/errors/image-not-found.error';
import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { DeleteImageCommandFactory } from '@module/image/use-cases/delete-image/__spec__/delete-image-command.factory';
import { DeleteImageCommand } from '@module/image/use-cases/delete-image/delete-image.command';
import { DeleteImageHandler } from '@module/image/use-cases/delete-image/delete-image.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';
import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(DeleteImageHandler.name, () => {
  let handler: DeleteImageHandler;

  let imageRepository: ImageRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let awsS3Adapter: AwsS3Port;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: DeleteImageCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        AppConfigModule,
        ImageRepositoryModule,
        AwsS3Module,
        EventStoreModule,
      ],
      providers: [DeleteImageHandler],
    }).compile();

    handler = module.get<DeleteImageHandler>(DeleteImageHandler);

    imageRepository = module.get<ImageRepositoryPort>(IMAGE_REPOSITORY);
    awsS3Adapter = module.get<AwsS3Port>(AWS_S3_PORT);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = DeleteImageCommandFactory.build();
  });

  beforeEach(() => {
    jest.spyOn(awsS3Adapter, 'deleteFile').mockResolvedValue(undefined);
  });

  describe('이미지를 삭제하면 ', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let image: Image;

    beforeEach(async () => {
      image = await imageRepository.insert(
        ImageFactory.build({ id: command.imageId }),
      );
    });

    it('이미지가 삭제돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeUndefined();

      await expect(
        imageRepository.findOneById(command.imageId),
      ).resolves.toBeUndefined();
    });
  });

  describe('이미지가 존재하지 않는 경우', () => {
    it('이미지가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(
        ImageNotFoundError,
      );
    });
  });
});
