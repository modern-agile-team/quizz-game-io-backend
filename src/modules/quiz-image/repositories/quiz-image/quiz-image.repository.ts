import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageMapper } from '@module/quiz-image/mappers/quiz-image.mapper';
import {
  FindAllQuizImagesOffsetPaginatedParams,
  QuizImageFilter,
  QuizImageOrder,
  QuizImageRaw,
  QuizImageRepositoryPort,
} from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
  IOffsetPaginated,
} from '@common/base/base.repository';

@Injectable()
export class QuizImageRepository
  extends BaseRepository<QuizImage, QuizImageRaw>
  implements QuizImageRepositoryPort
{
  protected TABLE_NAME = 'image';

  constructor(
    @InjectTransactionHost()
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(txHost, QuizImageMapper);
  }

  async findByFileNames(fileNames: string[]): Promise<QuizImage[]> {
    const quizImages = await this.txHost.tx.image.findMany({
      where: {
        fileName: {
          in: fileNames,
        },
      },
    });

    return quizImages.map((image) => QuizImageMapper.toEntity(image));
  }

  async findAllOffsetPaginated(
    params: FindAllQuizImagesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<QuizImage>> {
    const { pageInfo, filter } = params;

    const where = {};

    if (filter?.category) {
      Object.assign(where, { category: filter.category });
    }

    const quizImages = await this.txHost.tx.image.findMany({
      skip: pageInfo.offset,
      take: pageInfo.limit,
      where,
      orderBy: this.toOrderBy([{ field: 'id', direction: 'asc' }]),
    });
    const totalCount = await this.txHost.tx.image.count({ where });

    return {
      offset: pageInfo.offset,
      limit: pageInfo.limit,
      totalCount: totalCount,
      data: quizImages.map((image) => QuizImageMapper.toEntity(image)),
    };
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<QuizImageOrder, QuizImageFilter>,
  ): Promise<ICursorPaginated<QuizImage>> {
    throw new Error('Method not implemented.');
  }
}
