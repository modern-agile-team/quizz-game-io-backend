import { Test, TestingModule } from '@nestjs/testing';

import { ImageFactory } from '@module/image/entities/__spec__/image.factory';
import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { QuizFactory } from '@module/quiz/entities/__spec__/quiz.factory';
import { QuizImageNotFoundError } from '@module/quiz/errors/quiz-image-not-found.error';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { UpdateQuizCommandFactory } from '@module/quiz/use-cases/update-quiz/__spec__/update-quiz-command.factory';
import { UpdateQuizCommand } from '@module/quiz/use-cases/update-quiz/update-quiz.command';
import { UpdateQuizHandler } from '@module/quiz/use-cases/update-quiz/update-quiz.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(UpdateQuizHandler.name, () => {
  let handler: UpdateQuizHandler;

  let quizRepository: QuizRepositoryPort;
  let imageRepository: ImageRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: UpdateQuizCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        QuizRepositoryModule,
        ImageRepositoryModule,
        EventStoreModule,
        AppConfigModule,
      ],
      providers: [UpdateQuizHandler],
    }).compile();

    handler = module.get<UpdateQuizHandler>(UpdateQuizHandler);

    quizRepository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
    imageRepository = module.get<ImageRepositoryPort>(IMAGE_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = UpdateQuizCommandFactory.build();
  });

  beforeEach(async () => {
    await Promise.all([
      quizRepository.insert(
        QuizFactory.build({
          id: command.quizId,
        }),
      ),
      imageRepository.insert(
        ImageFactory.build({
          fileName: (command.imageUrl as string).split('/').pop() as string,
        }),
      ),
    ]);
  });

  describe('퀴즈를 업데이트 하면', () => {
    it('퀴즈가 업데이트 돼야한다.', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          id: command.quizId,
          type: command.type,
          question: command.question,
          answer: command.answer,
          imageUrl: command.imageUrl,
        }),
      );
    });
  });

  describe('퀴즈가 존재하지 않는 경우', () => {
    it('퀴즈가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(
        handler.execute({ ...command, quizId: generateEntityId() }),
      ).rejects.toThrow(QuizNotFoundError);
    });
  });

  describe('퀴즈 이미지 url에 해당하는 이미지가 존재하지 않는 경우', () => {
    it('퀴즈 이미지가 존재하지 않는다는 에러가 발생해야 한다.', async () => {
      await expect(
        handler.execute({ ...command, imageUrl: 'invalid url' }),
      ).rejects.toThrow(QuizImageNotFoundError);
    });
  });
});
