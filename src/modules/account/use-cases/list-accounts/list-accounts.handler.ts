import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Account } from '@module/account/entities/account.entity';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { ListAccountsQuery } from '@module/account/use-cases/list-accounts/list-accounts.query';

@QueryHandler(ListAccountsQuery)
export class ListAccountsHandler
  implements IQueryHandler<ListAccountsQuery, Account[]>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(query: ListAccountsQuery): Promise<Account[]> {
    return await this.accountRepository.findAllBy({
      filter: {
        isActive: query.isActive,
      },
    });
  }
}
