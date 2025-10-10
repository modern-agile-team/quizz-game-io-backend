import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Prisma } from '@prisma/client';

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

@Injectable()
export class AccountRepository
  extends BaseRepository<Account, AccountRaw>
  implements AccountRepositoryPort
{
  protected TABLE_NAME = 'account';

  constructor(
    @InjectTransactionHost()
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(txHost, AccountMapper);
  }

  async findAllBy(options: { filter: AccountFilter }): Promise<Account[]> {
    const { filter } = options;

    const where: Prisma.AccountWhereInput = {};

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    const accounts = await this.txHost.tx.account.findMany({
      where,
    });

    return accounts.map((account) => this.mapper.toEntity(account));
  }

  async findOneByUsername(username: string): Promise<Account | undefined> {
    const account = await this.txHost.tx.account.findFirst({
      where: {
        username,
      },
    });

    if (account === null) {
      return;
    }

    return this.mapper.toEntity(account);
  }

  async findOneByNickname(nickname: string): Promise<Account | undefined> {
    const account = await this.txHost.tx.account.findFirst({
      where: {
        nickname,
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
