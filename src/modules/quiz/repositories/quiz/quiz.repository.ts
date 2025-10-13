import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

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

@Injectable()
export class QuizRepository
  extends BaseRepository<Quiz, QuizRaw>
  implements QuizRepositoryPort
{
  protected TABLE_NAME = 'quiz';

  constructor(
    @InjectTransactionHost()
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(txHost, QuizMapper);
  }

  async insertMany(quizzes: Quiz[]): Promise<void> {
    await this.txHost.tx.quiz.createMany({
      data: quizzes.map((quiz) => QuizMapper.toPersistence(quiz)),
    });
  }

  async findAll(): Promise<Quiz[]> {
    const quizzes = await this.txHost.tx.quiz.findMany();

    return quizzes.map((quiz) => this.mapper.toEntity(quiz));
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<QuizOrder, QuizFilter>,
  ): Promise<ICursorPaginated<Quiz>> {
    throw new Error('Method not implemented.');
  }
}
