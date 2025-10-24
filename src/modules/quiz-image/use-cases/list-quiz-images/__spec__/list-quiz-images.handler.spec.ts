import { Test, TestingModule } from '@nestjs/testing';

import { QuizImageFactory } from '@module/quiz-image/entities/__spec__/quiz-image.factory';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { ListQuizImagesQueryFactory } from '@module/quiz-image/use-cases/list-quiz-images/__spec__/list-quiz-images-query.factory';
import { ListQuizImagesHandler } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.handler';
import { ListQuizImagesQuery } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(ListQuizImagesHandler.name, () => {
  let handler: ListQuizImagesHandler;

  let quizImageRepository: QuizImageRepositoryPort;

  let query: ListQuizImagesQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), QuizImageRepositoryModule],
      providers: [ListQuizImagesHandler],
    }).compile();

    handler = module.get<ListQuizImagesHandler>(ListQuizImagesHandler);

    quizImageRepository = module.get<QuizImageRepositoryPort>(
      QUIZ_IMAGE_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = ListQuizImagesQueryFactory.build();
  });

  describe('퀴즈 이미지의 페이지를 조회하면', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let quizImages: QuizImage[];

    beforeEach(async () => {
      quizImages = await Promise.all(
        QuizImageFactory.buildList(5).map((quizImage) =>
          quizImageRepository.insert(quizImage),
        ),
      );
    });

    it('퀴즈 이미지의 페이지가 반환돼야한다.', async () => {
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.data.length).toBeGreaterThanOrEqual(0);
      expect(result.currentPage).toBe(query.page ?? 1);
      expect(result.perPage).toBe(query.perPage ?? 20);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
    });
  });
});
