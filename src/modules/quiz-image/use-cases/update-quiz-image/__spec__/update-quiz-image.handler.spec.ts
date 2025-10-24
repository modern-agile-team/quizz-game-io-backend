import { Test, TestingModule } from '@nestjs/testing';

import { QuizImageFactory } from '@module/quiz-image/entities/__spec__/quiz-image.factory';
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { UpdateQuizImageCommandFactory } from '@module/quiz-image/use-cases/update-quiz-image/__spec__/update-quiz-image-command.factory';
import { UpdateQuizImageCommand } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.command';
import { UpdateQuizImageHandler } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.handler';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(UpdateQuizImageHandler.name, () => {
  let handler: UpdateQuizImageHandler;

  let quizImageRepository: QuizImageRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: UpdateQuizImageCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        QuizImageRepositoryModule,
        EventStoreModule,
      ],
      providers: [UpdateQuizImageHandler],
    }).compile();

    handler = module.get<UpdateQuizImageHandler>(UpdateQuizImageHandler);

    quizImageRepository = module.get<QuizImageRepositoryPort>(
      QUIZ_IMAGE_REPOSITORY,
    );
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = UpdateQuizImageCommandFactory.build();
  });

  describe('퀴즈 이미지를 업데이트하면', () => {
    beforeEach(async () => {
      await quizImageRepository.insert(
        QuizImageFactory.build({ id: command.quizImageId }),
      );
    });

    it('퀴즈 이미지가 업데이트 돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          id: command.quizImageId,
          name: command.name,
          category: command.category,
        }),
      );
    });
  });

  describe('퀴즈 이미지가 존재하지 않는 경우', () => {
    it('퀴즈 이미지가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(
        QuizImageNotFoundError,
      );
    });
  });
});
