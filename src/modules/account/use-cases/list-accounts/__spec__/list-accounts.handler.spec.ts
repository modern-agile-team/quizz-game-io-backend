import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { ListAccountsQueryFactory } from '@module/account/use-cases/list-accounts/__spec__/list-accounts-query.factory';
import { ListAccountsHandler } from '@module/account/use-cases/list-accounts/list-accounts.handler';
import { ListAccountsQuery } from '@module/account/use-cases/list-accounts/list-accounts.query';

describe(ListAccountsHandler.name, () => {
  let handler: ListAccountsHandler;

  let accountRepository: AccountRepositoryPort;

  let query: ListAccountsQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule],
      providers: [ListAccountsHandler],
    }).compile();

    handler = module.get<ListAccountsHandler>(ListAccountsHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    query = ListAccountsQueryFactory.build();
  });

  beforeEach(async () => {
    await Promise.all(
      AccountFactory.buildList(3).map((account) =>
        accountRepository.insert(account),
      ),
    );
  });
  describe('모든 계정 목록을 조회하면', () => {
    it('계정 목록이 조회돼야한다.', () => {
      expect(handler.execute({})).resolves.toSatisfyAll<Account>(
        (account) => account instanceof Account,
      );
    });
  });

  describe('활성 상태로 필터링된 계정 목록을 조회하면', () => {
    it('활성 상태로 필터링된 계정 목록이 조회돼야한다.', () => {
      expect(
        handler.execute({ isActive: false }),
      ).resolves.toSatisfyAll<Account>(
        (account) => account.isActive === query.isActive,
      );
    });
  });
});
