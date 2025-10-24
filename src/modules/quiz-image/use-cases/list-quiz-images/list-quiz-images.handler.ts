import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { ListQuizImagesQuery } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.query';

import { OffsetPage } from '@common/base/base.entity';

@QueryHandler(ListQuizImagesQuery)
export class ListQuizImagesHandler
  implements IQueryHandler<ListQuizImagesQuery, OffsetPage<QuizImage>>
{
  constructor(
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
  ) {}

  async execute(query: ListQuizImagesQuery): Promise<OffsetPage<QuizImage>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const result = await this.quizImageRepository.findAllOffsetPaginated({
      pageInfo: {
        offset: (page - 1) * perPage,
        limit: perPage,
      },
      filter: {
        category: query.category,
      },
    });

    return new OffsetPage(result.data, page, perPage, result.totalCount);
  }
}
