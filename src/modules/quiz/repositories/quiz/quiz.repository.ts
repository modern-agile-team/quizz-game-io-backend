import { Inject, Injectable } from '@nestjs/common';

import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizMapper } from '@module/quiz/mappers/quiz.mapper';
import {
  QuizFilter,
  QuizOrder,
  QuizRaw,
  QuizRepositoryPort,
} from '@module/quiz/repositories/quiz/quiz.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class QuizRepository
  extends BaseRepository<Quiz, QuizRaw>
  implements QuizRepositoryPort
{
  protected TABLE_NAME = 'quiz';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, QuizMapper);
  }

  async findAll(): Promise<Quiz[]> {
    const quizzes = await this.prismaService.quiz.findMany();

    return quizzes.map((quiz) => this.mapper.toEntity(quiz));
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<QuizOrder, QuizFilter>,
  ): Promise<ICursorPaginated<Quiz>> {
    throw new Error('Method not implemented.');
  }
}
