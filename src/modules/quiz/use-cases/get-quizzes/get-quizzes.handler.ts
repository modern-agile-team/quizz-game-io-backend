import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { GetQuizzesQuery } from '@module/quiz/use-cases/get-quizzes/get-quizzes.query';

@QueryHandler(GetQuizzesQuery)
export class GetQuizzesHandler implements IQueryHandler<GetQuizzesQuery, Quiz> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
  ) {}

  async execute(query: GetQuizzesQuery): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneById(query.quizId);

    if (quiz === undefined) {
      throw new QuizNotFoundError();
    }

    return quiz;
  }
}
