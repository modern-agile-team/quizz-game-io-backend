import { Inject, Injectable } from '@nestjs/common';

import { Account } from '@module/account/entities/account.entity';
import { AccountMapper } from '@module/account/mappers/account.mapper';
import {
  AccountFilter,
  AccountOrder,
  AccountRaw,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class AccountRepository
  extends BaseRepository<Account, AccountRaw>
  implements AccountRepositoryPort
{
  protected TABLE_NAME = 'account';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, AccountMapper);
  }

  async findOneByUsername(username: string): Promise<Account | undefined> {
    const account = await this.prismaService.account.findFirst({
      where: {
        username,
      },
    });

    if (account === null) {
      return;
    }

    return this.mapper.toEntity(account);
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<AccountOrder, AccountFilter>,
  ): Promise<ICursorPaginated<Account>> {
    throw new Error('Method not implemented.');
  }
}
