import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';

import { AccountEnteredEvent } from '@module/account/events/account-entered-event/account-entered.event';
import { AccountEnteredHandler } from '@module/account/events/account-entered-event/account-entered.handler';
import {
  ACTIVE_ACCOUNT_STORE,
  IActiveAccountStore,
} from '@module/account/stores/active-account/active-account.store.interface';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { generateEntityId } from '@common/base/base.entity';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

describe(AccountEnteredHandler, () => {
  let handler: AccountEnteredHandler;

  let activeAccountStore: IActiveAccountStore;
  let socketEmitter: ISocketEventEmitter;

  let event: AccountEnteredEvent;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        ActiveAccountStoreModule,
        SocketEventEmitterModule,
      ],
      providers: [AccountEnteredHandler],
    }).compile();

    handler = module.get<AccountEnteredHandler>(AccountEnteredHandler);
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

  beforeEach(() => {
    event = new AccountEnteredEvent(generateEntityId(), {
      nickname: generateEntityId(),
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
