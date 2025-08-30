import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { generateEntityId } from '@common/base/base.entity';

import { CacheModule } from '@shared/cache/cache.module';

import { AccountSocketIndexStore } from '@core/socket/index-store/account-socket-index.store';
import {
  ACCOUNT_SOCKET_INDEX_STORE,
  IAccountSocketIndexStore,
} from '@core/socket/index-store/account-socket-index.store.interface';

describe(AccountSocketIndexStore, () => {
  let store: IAccountSocketIndexStore;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CacheModule, AppConfigModule],
      providers: [
        {
          provide: ACCOUNT_SOCKET_INDEX_STORE,
          useClass: AccountSocketIndexStore,
        },
      ],
    }).compile();

    store = module.get<IAccountSocketIndexStore>(ACCOUNT_SOCKET_INDEX_STORE);
  });

  afterEach(async () => {
    await module.close();
  });

  let accountId: string;
  let socketId: string;

  beforeEach(() => {
    accountId = generateEntityId();
    socketId = faker.string.nanoid();
  });

  describe(AccountSocketIndexStore.prototype.get, () => {
    describe('인덱스가 존재하는 경우', () => {
      beforeEach(async () => {
        await store.set(accountId, socketId);
      });

      it('인덱스를 반환해야한다.', async () => {
        await expect(store.get(accountId)).resolves.toBe(socketId);
      });
    });

    describe('인덱스가 존재하지 않는 경우', () => {
      it('undefined를 반환해야한다.', async () => {
        await expect(store.get(accountId)).resolves.toBeUndefined();
      });
    });
  });

  describe(AccountSocketIndexStore.prototype.set, () => {
    describe('인덱스가 존재하는 경우', () => {
      beforeEach(async () => {
        await store.set(accountId, socketId);
      });

      it('기존 인덱스를 덮어써야한다.', async () => {
        const newSocketId = faker.string.nanoid();
        await expect(
          store.set(accountId, newSocketId),
        ).resolves.toBeUndefined();
        await expect(store.get(accountId)).resolves.toBe(newSocketId);
      });
    });

    describe('인덱스가 존재하지 않는 경우', () => {
      it('새로운 인덱스를 생성해야한다.', async () => {
        await expect(store.set(accountId, socketId)).resolves.toBeUndefined();
        await expect(store.get(accountId)).resolves.toBe(socketId);
      });
    });
  });

  describe(AccountSocketIndexStore.prototype.del, () => {
    describe('인덱스가 존재하는 경우', () => {
      beforeEach(async () => {
        await store.set(accountId, socketId);
      });

      it('인덱스를 제거해야한다.', async () => {
        await expect(store.del(accountId)).resolves.toBeUndefined();
        await expect(store.get(accountId)).resolves.toBeUndefined();
      });
    });

    describe('인덱스가 존재하지 않는 경우', () => {
      it('undefined를 반환해야한다.', async () => {
        await expect(store.del(accountId)).resolves.toBeUndefined();
        await expect(store.get(accountId)).resolves.toBeUndefined();
      });
    });
  });
});
