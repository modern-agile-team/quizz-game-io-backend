import { Test, TestingModule } from '@nestjs/testing';

import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { CreateQuizImageCommandFactory } from '@module/quiz-image/use-cases/create-quiz-image/__spec__/create-quiz-image-command.factory';
import { CreateQuizImageCommand } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.command';
import { CreateQuizImageHandler } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { AppConfigService } from '@common/app-config/app-config.service';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';
import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateQuizImageHandler.name, () => {
  let handler: CreateQuizImageHandler;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let quizImageRepository: QuizImageRepositoryPort;
  let awsS3Adapter: AwsS3Port;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appConfigService: AppConfigService;

  let command: CreateQuizImageCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        QuizImageRepositoryModule,
        AwsS3Module,
        EventStoreModule,
        AppConfigModule,
        ClsModuleFactory(),
      ],
      providers: [CreateQuizImageHandler],
    }).compile();

    handler = module.get<CreateQuizImageHandler>(CreateQuizImageHandler);

    quizImageRepository = module.get<QuizImageRepositoryPort>(
      QUIZ_IMAGE_REPOSITORY,
    );
    awsS3Adapter = module.get<AwsS3Port>(AWS_S3_PORT);
    eventStore = module.get<IEventStore>(EVENT_STORE);
    appConfigService = module.get<AppConfigService>(AppConfigService);
  });

  beforeEach(() => {
    command = CreateQuizImageCommandFactory.build();
  });

  beforeEach(() => {
    jest.spyOn(awsS3Adapter, 'uploadFile').mockResolvedValue(undefined);
  });

  describe('퀴즈 이미지를 업로드하는 경우', () => {
    it('퀴즈 이미지가 생성되어야 한다.', async () => {
      await expect(handler.execute(command)).resolves.toMatchObject<
        Partial<QuizImage>
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
