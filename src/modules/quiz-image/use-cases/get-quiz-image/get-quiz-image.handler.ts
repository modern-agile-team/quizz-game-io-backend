import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import {
  QUIZ_IMAGE_REPOSITORY,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';
import { GetQuizImageQuery } from '@module/quiz-image/use-cases/get-quiz-image/get-quiz-image.query';

@QueryHandler(GetQuizImageQuery)
export class GetQuizImageHandler
  implements IQueryHandler<GetQuizImageQuery, unknown>
{
  constructor(
    @Inject(QUIZ_IMAGE_REPOSITORY)
    private readonly quizImageRepository: QuizImageRepositoryPort,
  ) {}

  async execute(query: GetQuizImageQuery): Promise<unknown> {
    const quizImage = await this.quizImageRepository.findOneById(
      query.quizImageId,
    );

    if (quizImage === undefined) {
      throw new QuizImageNotFoundError();
    }

    return quizImage;
  }
}
