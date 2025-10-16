import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { ActiveAccountStore } from '@module/account/stores/active-account/active-account.store';
import { ACTIVE_ACCOUNT_STORE } from '@module/account/stores/active-account/active-account.store.interface';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';
import { GetActiveAccountCountQueryFactory } from '@module/account/use-cases/get-active-account-count/__spec__/get-active-account-count-query.factory';
import { GetActiveAccountCountHandler } from '@module/account/use-cases/get-active-account-count/get-active-account-count.handler';
import { GetActiveAccountCountQuery } from '@module/account/use-cases/get-active-account-count/get-active-account-count.query';

describe(GetActiveAccountCountHandler.name, () => {
  let handler: GetActiveAccountCountHandler;

  let activeAccountStore: ActiveAccountStore;

  let query: GetActiveAccountCountQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ActiveAccountStoreModule],
      providers: [GetActiveAccountCountHandler],
    }).compile();

    handler = module.get<GetActiveAccountCountHandler>(
      GetActiveAccountCountHandler,
    );

    activeAccountStore = module.get<ActiveAccountStore>(ACTIVE_ACCOUNT_STORE);
  });

  beforeEach(() => {
    query = GetActiveAccountCountQueryFactory.build();
  });

  let currentActiveAccountCount: number;

  beforeEach(() => {
    currentActiveAccountCount = faker.number.int({ min: 0, max: 100 });
    jest
      .spyOn(activeAccountStore, 'get')
      .mockResolvedValue(currentActiveAccountCount);
  });

  describe('현재 활성 유저수를 조회하면', () => {
    it('활성 유저수를 반환해야한다...', async () => {
      await expect(handler.execute(query)).resolves.toBe(
        currentActiveAccountCount,
      );
    });
  });
});
