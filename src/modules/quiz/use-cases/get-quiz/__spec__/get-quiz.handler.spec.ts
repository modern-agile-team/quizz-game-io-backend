import { Test, TestingModule } from '@nestjs/testing';

import { QuizFactory } from '@module/quiz/entities/__spec__/quiz.factory';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { GetQuizQueryFactory } from '@module/quiz/use-cases/get-quiz/__spec__/get-quiz-query.factory';
import { GetQuizHandler } from '@module/quiz/use-cases/get-quiz/get-quiz.handler';
import { GetQuizQuery } from '@module/quiz/use-cases/get-quiz/get-quiz.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(GetQuizHandler.name, () => {
  let handler: GetQuizHandler;

  let quizRepository: QuizRepositoryPort;

  let query: GetQuizQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), QuizRepositoryModule],
      providers: [GetQuizHandler],
    }).compile();

    handler = module.get<GetQuizHandler>(GetQuizHandler);

    quizRepository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
  });

  beforeEach(() => {
    query = GetQuizQueryFactory.build();
  });

  describe('퀴즈를 조회하면', () => {
    beforeEach(async () => {
      await quizRepository.insert(QuizFactory.build({ id: query.quizId }));
    });

    it('퀴즈가 정상적으로 반환되어야 한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(
        expect.objectContaining({
          id: query.quizId,
        }),
      );
    });
  });

  describe('퀴즈가 존재하지 않는 경우', () => {
    it('퀴즈가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(
        QuizNotFoundError,
      );
    });
  });
});
