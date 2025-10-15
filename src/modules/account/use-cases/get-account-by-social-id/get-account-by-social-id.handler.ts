import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetAccountBySocialIdQuery } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.query';

@QueryHandler(GetAccountBySocialIdQuery)
export class GetAccountBySocialIdHandler
  implements IQueryHandler<GetAccountBySocialIdQuery, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(query: GetAccountBySocialIdQuery): Promise<Account> {
    const account = await this.accountRepository.findOneBySocialId(
      query.provider,
      query.providerUid,
    );

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    return account;
  }
}
