import { Test, TestingModule } from '@nestjs/testing';

import { QuizFactory } from '@module/quiz/entities/__spec__/quiz.factory';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizRepositoryModule } from '@module/quiz/repositories/quiz/quiz.repository.module';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { ListQuizzesQueryFactory } from '@module/quiz/use-cases/list-quizzes/__spec__/list-quizzes-query.factory';
import { ListQuizzesHandler } from '@module/quiz/use-cases/list-quizzes/list-quizzes.handler';
import { ListQuizzesQuery } from '@module/quiz/use-cases/list-quizzes/list-quizzes.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(ListQuizzesHandler.name, () => {
  let handler: ListQuizzesHandler;

  let quizRepository: QuizRepositoryPort;

  let query: ListQuizzesQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), QuizRepositoryModule],
      providers: [ListQuizzesHandler],
    }).compile();

    handler = module.get<ListQuizzesHandler>(ListQuizzesHandler);

    quizRepository = module.get<QuizRepositoryPort>(QUIZ_REPOSITORY);
  });

  beforeEach(() => {
    query = ListQuizzesQueryFactory.build({ type: undefined });
  });

  beforeEach(async () => {
    await Promise.all(
      QuizFactory.buildList(3).map((quiz) => quizRepository.insert(quiz)),
    );
  });

  describe('퀴즈 목록을 조회하면', () => {
    it('Quiz 인스턴스로 구성된 배열을 반환해야 한다.', async () => {
      await expect(handler.execute(query)).resolves.toSatisfyAll<Quiz>(
        (quiz) => quiz instanceof Quiz,
      );
    });
  });
});
