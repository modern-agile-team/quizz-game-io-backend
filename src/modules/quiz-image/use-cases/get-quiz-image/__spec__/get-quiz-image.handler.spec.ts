import { Test, TestingModule } from '@nestjs/testing';

import { QuizImageFactory } from '@module/quiz-image/entities/__spec__/quiz-image.factory';
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { GetQuizImageQueryFactory } from '@module/quiz-image/use-cases/get-quiz-image/__spec__/get-quiz-image-query.factory';
import { GetQuizImageHandler } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.handler';
import { GetQuizImageQuery } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(GetQuizImageHandler.name, () => {
  let handler: GetQuizImageHandler;

  let quizImageRepository: QuizImageRepositoryPort;

  let query: GetQuizImageQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), QuizImageRepositoryModule],
      providers: [GetQuizImageHandler],
    }).compile();

    handler = module.get<GetQuizImageHandler>(GetQuizImageHandler);

    quizImageRepository = module.get<QuizImageRepositoryPort>(
      QUIZ_IMAGE_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = GetQuizImageQueryFactory.build();
  });

  describe('식별자와 일치하는 퀴즈 이미지를 조회하면', () => {
    beforeEach(async () => {
      await quizImageRepository.insert(
        QuizImageFactory.build({ id: query.quizImageId }),
      );
    });

    it('퀴즈 이미지가 조회돼야한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(
        expect.objectContaining({
          id: query.quizImageId,
        }),
      );
    });
  });

  describe('식별자와 일치하는 퀴즈 이미지가 존재하지 않는 경우', () => {
    it('퀴즈 이미지가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(query)).rejects.toThrow(
        QuizImageNotFoundError,
      );
    });
  });
});
