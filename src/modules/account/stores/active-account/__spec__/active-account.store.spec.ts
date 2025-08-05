import { Test, TestingModule } from '@nestjs/testing';

import { ActiveAccountStore } from '@module/account/stores/active-account/active-account.store';
import { ACTIVE_ACCOUNT_STORE } from '@module/account/stores/active-account/active-account.store.interface';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { CacheClient } from '@shared/cache/cache.client';
import { CACHE_CLIENT } from '@shared/cache/cache.client.interface';
import { CacheModule } from '@shared/cache/cache.module';

describe(ActiveAccountStore.name, () => {
  let store: ActiveAccountStore;
  let cacheClient: CacheClient<number>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule, AppConfigModule],
      providers: [
        {
          provide: ACTIVE_ACCOUNT_STORE,
          useClass: ActiveAccountStore,
        },
      ],
    }).compile();

    store = module.get<ActiveAccountStore>(ACTIVE_ACCOUNT_STORE);
    cacheClient = module.get<CacheClient<number>>(CACHE_CLIENT);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await cacheClient.set('active_account_count', 0);
  });

  describe(ActiveAccountStore.prototype.increment, () => {
    it('현재 활성 계정 수를 1 증가시켜야한다.', async () => {
      const originCount = await store.get();

      await expect(store.increment()).resolves.toBe(originCount + 1);
    });
  });

  describe(ActiveAccountStore.prototype.decrement, () => {
    describe('현재 활성 계정 수가 1 이상인 경우', () => {
      beforeEach(async () => {
        await store.increment();
      });

      it('현재 활성 계정 수를 1 감소시켜야한다.', async () => {
        const originCount = await store.get();

        await expect(store.decrement()).resolves.toBe(originCount - 1);
      });
    });

    describe('현재 활성 계정 수가 0인 경우', () => {
      it('경고 로그를 출력하고 0을 반환해야한다.', async () => {
        const warnSpy = jest.spyOn(store['logger'], 'warn');

        await expect(store.decrement()).resolves.toBe(0);
        expect(warnSpy).toHaveBeenCalled();
      });
    });
  });

  describe(ActiveAccountStore.prototype.get, () => {
    it('현재 활성 계정 수를 반환해야한다.', async () => {
      const count = await store.get();

      expect(count).toBe(0);
    });
  });
});
