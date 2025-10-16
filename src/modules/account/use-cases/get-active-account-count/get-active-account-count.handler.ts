import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ActiveAccountStore } from '@module/account/stores/active-account/active-account.store';
import { ACTIVE_ACCOUNT_STORE } from '@module/account/stores/active-account/active-account.store.interface';
import { GetActiveAccountCountQuery } from '@module/account/use-cases/get-active-account-count/get-active-account-count.query';

@QueryHandler(GetActiveAccountCountQuery)
export class GetActiveAccountCountHandler
  implements IQueryHandler<GetActiveAccountCountQuery, number>
{
  constructor(
    @Inject(ACTIVE_ACCOUNT_STORE)
    private readonly activeAccountStore: ActiveAccountStore,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetActiveAccountCountQuery): Promise<number> {
    return await this.activeAccountStore.get();
  }
}
