import { Test, TestingModule } from '@nestjs/testing';

import { QuizImageFactory } from '@module/quiz-image/entities/__spec__/quiz-image.factory';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageInUsedError } from '@module/quiz-image/errors/quiz-image-in-used.error';
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { DeleteQuizImageCommandFactory } from '@module/quiz-image/use-cases/delete-quiz-image/__spec__/delete-quiz-image-command.factory';
import { DeleteQuizImageCommand } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.command';
import { DeleteQuizImageHandler } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.handler';
import { QuizFactory } from '@module/quiz/entities/__spec__/quiz.factory';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';
import { AWS_S3_PORT, AwsS3Port } from '@shared/services/aws-s3/aws-s3.port';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(DeleteQuizImageHandler.name, () => {
  let handler: DeleteQuizImageHandler;

  let quizImageRepository: QuizImageRepositoryPort;
  let quizRepository: QuizRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let awsS3Adapter: AwsS3Port;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: DeleteQuizImageCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        AppConfigModule,
        QuizImageRepositoryModule,
        QuizRepositoryModule,
        AwsS3Module,
        EventStoreModule,
      ],
      providers: [DeleteQuizImageHandler],
    }).compile();

    handler = module.get<DeleteQuizImageHandler>(DeleteQuizImageHandler);

    quizImageRepository = module.get<QuizImageRepositoryPort>(
      QUIZ_IMAGE_REPOSITORY,
    );
    quizRepository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
    awsS3Adapter = module.get<AwsS3Port>(AWS_S3_PORT);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = DeleteQuizImageCommandFactory.build();
  });

  beforeEach(() => {
    jest.spyOn(awsS3Adapter, 'deleteFile').mockResolvedValue(undefined);
  });

  describe('퀴즈 이미지를 삭제하면 ', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let quizImage: QuizImage;

    beforeEach(async () => {
      quizImage = await quizImageRepository.insert(
        QuizImageFactory.build({ id: command.quizImageId }),
      );
    });

    it('퀴즈 이미지가 삭제돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeUndefined();

      await expect(
        quizImageRepository.findOneById(command.quizImageId),
      ).resolves.toBeUndefined();
    });
  });

  describe('퀴즈 이미지가 존재하지 않는 경우', () => {
    it('퀴즈 이미지가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(
        QuizImageNotFoundError,
      );
    });
  });

  describe('퀴즈 이미지를 사용중인 퀴즈가 존재하는 경우', () => {
    beforeEach(async () => {
      const quizImage = await quizImageRepository.insert(
        QuizImageFactory.build({ id: command.quizImageId }),
      );
      await quizRepository.insert(
        QuizFactory.build({ imageFileName: quizImage.fileName }),
      );
    });

    it('사용중인 퀴즈는 삭제할 수 없다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(
        QuizImageInUsedError,
      );
    });
  });
});
