import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ImageFactory } from '@module/image/entities/__spec__/image.factory';
import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { CreateQuizzesCommandFactory } from '@module/quiz/use-cases/create-quizzes/__spec__/create-quizzes-command.factory';
import { CreateQuizzesCommand } from '@module/quiz/use-cases/create-quizzes/create-quizzes.command';
import { CreateQuizzesHandler } from '@module/quiz/use-cases/create-quizzes/create-quizzes.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateQuizzesHandler.name, () => {
  let handler: CreateQuizzesHandler;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let quizRepository: QuizRepositoryPort;
  let imageRepository: ImageRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: CreateQuizzesCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        ClsModuleFactory(),
        QuizRepositoryModule,
        ImageRepositoryModule,
        EventStoreModule,
      ],
      providers: [CreateQuizzesHandler],
    }).compile();

    handler = module.get<CreateQuizzesHandler>(CreateQuizzesHandler);

    quizRepository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
    imageRepository = module.get<ImageRepositoryPort>(IMAGE_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = CreateQuizzesCommandFactory.build();
  });

  describe('퀴즈를 대량 생성하면', () => {
    beforeEach(async () => {
      const images = await Promise.all(
        [faker.string.nanoid(), faker.string.nanoid()]
          .map((filaName) => ImageFactory.build({ fileName: filaName }))
          .map((image) => imageRepository.insert(image)),
      );

      command = new CreateQuizzesCommand([
        {
          type: 'text',
          question: 'question with valid image',
          answer: 'answer1',
          imageUrl: `${process.env.AWS_S3_URL}/images/${images[0].fileName}`,
        },
        {
          type: 'text',
          question: 'question with another valid image',
          answer: 'answer2',
          imageUrl: `${process.env.AWS_S3_URL}/images/${images[1].fileName}`,
        },
        {
          type: 'text',
          question: 'question with invalid image',
          answer: 'answer3',
          imageUrl: `${process.env.AWS_S3_URL}/invalid.png`,
        },
      ]);
    });

    it('유효한 퀴즈만 생성해야한다.', async () => {
      await expect(handler.execute(command)).resolves.toHaveLength(2);
    });
  });
});
