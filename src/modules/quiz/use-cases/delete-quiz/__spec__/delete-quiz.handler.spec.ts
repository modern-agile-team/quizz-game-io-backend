import { Test, TestingModule } from '@nestjs/testing';

import { QuizFactory } from '@module/quiz/entities/__spec__/quiz.factory';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { DeleteQuizCommandFactory } from '@module/quiz/use-cases/delete-quiz/__spec__/delete-quiz-command.factory';
import { DeleteQuizCommand } from '@module/quiz/use-cases/delete-quiz/delete-quiz.command';
import { DeleteQuizHandler } from '@module/quiz/use-cases/delete-quiz/delete-quiz.handler';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(DeleteQuizHandler.name, () => {
  let handler: DeleteQuizHandler;

  let quizRepository: QuizRepositoryPort;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let eventStore: IEventStore;

  let command: DeleteQuizCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), QuizRepositoryModule, EventStoreModule],
      providers: [DeleteQuizHandler],
    }).compile();

    handler = module.get<DeleteQuizHandler>(DeleteQuizHandler);

    quizRepository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = DeleteQuizCommandFactory.build();
  });

  describe('퀴즈를 삭제하면', () => {
    beforeEach(async () => {
      await quizRepository.insert(QuizFactory.build({ id: command.quizId }));
    });

    it('퀴즈가 삭제되어야 한다.', async () => {
      await expect(handler.execute(command)).resolves.toBeUndefined();

      await expect(
        quizRepository.findOneById(command.quizId),
      ).resolves.toBeUndefined();
    });
  });

  describe('퀴즈가 존재하지 않는 경우', () => {
    it('퀴즈가 존재하지 않는다는 에러가 발생해야 한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(QuizNotFoundError);
    });
  });
});
