import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { EnterAccountCommandFactory } from '@module/account/use-cases/enter-account/__spec__/enter-account-command.factory';
import { EnterAccountCommand } from '@module/account/use-cases/enter-account/enter-account.command';
import { EnterAccountHandler } from '@module/account/use-cases/enter-account/enter-account.handler';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';
import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(EnterAccountHandler.name, () => {
  let handler: EnterAccountHandler;

  let accountRepository: AccountRepositoryPort;
  let eventStore: IEventStore;

  let command: EnterAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule, EventStoreModule],
      providers: [EnterAccountHandler],
    }).compile();

    handler = module.get<EnterAccountHandler>(EnterAccountHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    eventStore = module.get<IEventStore>(EVENT_STORE);
  });

  beforeEach(() => {
    command = EnterAccountCommandFactory.build();

    jest.spyOn(eventStore, 'storeAggregateEvents');
  });

  describe('식별자와 일치하는 계정이 존재하는 경우', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let account: Account;

    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({ id: command.accountId, enteredAt: undefined }),
      );
    });

    it('계정을 활성화하고 이벤트를 저장한다', async () => {
      await expect(handler.execute(command)).resolves.toEqual(
        expect.objectContaining({
          id: command.accountId,
          enteredAt: expect.any(Date),
        }),
      );
      expect(eventStore.storeAggregateEvents).toHaveBeenCalled();
    });
  });

  describe('식별자와 일치하는 계정이 존재하지 않는 경우', () => {
    it('계정이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        AccountNotFoundError,
      );
    });
  });
});
