import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountEnteredEvent } from '@module/account/events/account-entered-event/account-entered.event';
import { AccountEnteredHandler } from '@module/account/events/account-entered-event/account-entered.handler';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  ACTIVE_ACCOUNT_STORE,
  IActiveAccountStore,
} from '@module/account/stores/active-account/active-account.store.interface';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';
import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

describe(AccountEnteredHandler, () => {
  let handler: AccountEnteredHandler;

  let accountRepository: AccountRepositoryPort;
  let activeAccountStore: IActiveAccountStore;
  let eventPublisher: ISocketEventPublisher;

  let event: AccountEnteredEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClsModuleFactory(),
        AccountRepositoryModule,
        AppConfigModule,
        ActiveAccountStoreModule,
        SocketEventPublisherModule,
      ],
      providers: [AccountEnteredHandler],
    }).compile();

    handler = module.get<AccountEnteredHandler>(AccountEnteredHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    activeAccountStore = module.get<IActiveAccountStore>(ACTIVE_ACCOUNT_STORE);
    eventPublisher = module.get<ISocketEventPublisher>(SOCKET_EVENT_PUBLISHER);
  });

  beforeEach(() => {
    jest
      .spyOn(eventPublisher, 'publishToLobby')
      .mockResolvedValue(undefined as never);
    jest.spyOn(activeAccountStore, 'increment');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  let account: Account;

  beforeEach(async () => {
    account = AccountFactory.build();

    event = new AccountEnteredEvent(account.id, {
      nickname: account.nickname,
      enteredAt: new Date(),
    });
  });

  describe('handle', () => {
    beforeEach(async () => {
      await accountRepository.insert(account);
    });

    it('현재 활성 계정수를 1 증가시키고 이벤트를 발행시켜야 한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(activeAccountStore.increment).toHaveBeenCalled();
      expect(eventPublisher.publishToLobby).toHaveBeenCalledTimes(2);
    });
  });

  describe('계정이 존재하지 않는 경우', () => {
    it('계정이 존재하지 않는다는 에러가 발생해야 한다.', async () => {
      await expect(handler.handle(event)).rejects.toThrow(AccountNotFoundError);
    });
  });
});
