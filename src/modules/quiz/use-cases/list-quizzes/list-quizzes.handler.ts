import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Quiz } from '@module/quiz/entities/quiz.entity';
import {
  QUIZ_REPOSITORY,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';
import { ListQuizzesQuery } from '@module/quiz/use-cases/list-quizzes/list-quizzes.query';

@QueryHandler(ListQuizzesQuery)
export class ListQuizzesHandler
  implements IQueryHandler<ListQuizzesQuery, Quiz[]>
{
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepository: QuizRepositoryPort,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: ListQuizzesQuery): Promise<Quiz[]> {
    return await this.quizRepository.findAll();
  }
}
