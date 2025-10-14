import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceMapper } from '@module/nickname-source/mappers/nickname-source.mapper';
import {
  NicknameSourceFilter,
  NicknameSourceOrder,
  NicknameSourceRaw,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
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

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<NicknameSourceOrder, NicknameSourceFilter>,
  ): Promise<ICursorPaginated<NicknameSource>> {
    throw new Error('Method not implemented.');
  }
}
