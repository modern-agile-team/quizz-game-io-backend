import { Injectable } from '@nestjs/common';

import { EntityManager } from '@mikro-orm/postgresql';

import { Account } from '@module/account/entities/account.entity';
import { AccountMapper } from '@module/account/mappers/account.mapper';
import { AccountOrmEntity } from '@module/account/repositories/account/account.orm-entity';
import {
  AccountFilter,
  AccountOrder,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

@Injectable()
export class AccountRepository
  extends BaseRepository<Account, AccountOrmEntity>
  implements AccountRepositoryPort
{
  constructor(protected readonly em: EntityManager) {
    super(em, AccountOrmEntity, AccountMapper);
  }

  async findOneByUsername(username: string): Promise<Account | undefined> {
    const account = await this.em.findOne(AccountOrmEntity, {
      username,
    });

    if (account === null) {
      return;
    }

    return this.mapper.toEntity(account);
  }

  findAllCursorPaginated(
    params: ICursorPaginatedParams<AccountFilter, AccountOrder>,
  ): Promise<ICursorPaginated<Account>> {
    throw new Error('Method not implemented.');
  }
}
