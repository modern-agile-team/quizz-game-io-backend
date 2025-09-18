import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
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

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(AccountEnteredHandler, () => {
  let handler: AccountEnteredHandler;

  let accountRepository: AccountRepositoryPort;
  let activeAccountStore: IActiveAccountStore;
  let socketEmitter: ISocketEventEmitter;

  let event: AccountEnteredEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AccountRepositoryModule,
        AppConfigModule,
        ActiveAccountStoreModule,
        SocketEventEmitterModule,
      ],
      providers: [AccountEnteredHandler],
    }).compile();

    handler = module.get<AccountEnteredHandler>(AccountEnteredHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    activeAccountStore = module.get<IActiveAccountStore>(ACTIVE_ACCOUNT_STORE);
    socketEmitter = module.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
  });

  beforeEach(() => {
    jest
      .spyOn(socketEmitter, 'emitToNamespace')
      .mockResolvedValue(undefined as never);
    jest.spyOn(activeAccountStore, 'increment');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const account = await accountRepository.insert(AccountFactory.build());
    event = new AccountEnteredEvent(account.id, {
      nickname: account.nickname,
      enteredAt: new Date(),
    });
  });

  describe('handle', () => {
    it('현재 활성 계정수를 1 증가시키고 이벤트를 발행시켜야 한다.', async () => {
      await expect(handler.handle(event)).resolves.toBeUndefined();

      expect(activeAccountStore.increment).toHaveBeenCalled();
      expect(socketEmitter.emitToNamespace).toHaveBeenCalled();
    });
  });
});
