import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceMapper } from '@module/nickname-source/mappers/nickname-source.mapper';
import {
  FindAllNicknameSourcesOffsetPaginatedParams,
  NicknameSourceFilter,
  NicknameSourceOrder,
  NicknameSourceRaw,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';

import { RecordNotFoundError } from '@common/base/base.error';
import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
  IOffsetPaginated,
} from '@common/base/base.repository';

@Injectable()
export class NicknameSourceRepository
  extends BaseRepository<NicknameSource, NicknameSourceRaw>
  implements NicknameSourceRepositoryPort
{
  protected TABLE_NAME = 'nicknameSource';

  constructor(
    @InjectTransactionHost()
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(txHost, NicknameSourceMapper);
  }

  async incrementSequence(id: string): Promise<number> {
    try {
      const nicknameSource = await this.txHost.tx.nicknameSource.update({
        where: {
          id: this.mapper.toPrimaryKey(id),
        },
        data: {
          sequence: {
            increment: 1,
          },
        },
      });

      return nicknameSource.sequence;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RecordNotFoundError();
        }
      }

      throw error;
    }
  }

  async findOneByName(name: string): Promise<NicknameSource | undefined> {
    const nicknameSource = await this.txHost.tx.nicknameSource.findFirst({
      where: {
        name: name,
      },
    });

    if (nicknameSource === null) {
      return;
    }

    return this.mapper.toEntity(nicknameSource);
  }

  async findAllOffsetPaginated(
    params: FindAllNicknameSourcesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<NicknameSource>> {
    const { pageInfo } = params;

    const nicknameSources = await this.txHost.tx.nicknameSource.findMany({
      skip: pageInfo.offset,
      take: pageInfo.limit,
      orderBy: this.toOrderBy(
        params.order ?? [{ field: 'id', direction: 'asc' }],
      ),
    });
    const totalCount = await this.txHost.tx.nicknameSource.count({});

    return {
      offset: pageInfo.offset,
      limit: pageInfo.limit,
      totalCount: totalCount,
      data: nicknameSources.map((nicknameSource) =>
        this.mapper.toEntity(nicknameSource),
      ),
    };
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<NicknameSourceOrder, NicknameSourceFilter>,
  ): Promise<ICursorPaginated<NicknameSource>> {
    throw new Error('Method not implemented.');
  }
}
