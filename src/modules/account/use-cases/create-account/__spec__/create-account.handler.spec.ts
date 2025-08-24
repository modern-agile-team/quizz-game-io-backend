import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommandFactory } from '@module/account/use-cases/create-account/__spec__/create-account-command.factory';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';
import { CreateAccountHandler } from '@module/account/use-cases/create-account/create-account.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateAccountHandler.name, () => {
  let handler: CreateAccountHandler;
  let accountRepository: AccountRepositoryPort;

  let command: CreateAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountRepositoryModule, EventStoreModule],
      providers: [CreateAccountHandler],
    }).compile();

    handler = module.get<CreateAccountHandler>(CreateAccountHandler);
    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    command = CreateAccountCommandFactory.build();
  });

  describe('계정을 생성하면', () => {
    it('계정이 생성돼야한다.', async () => {
      const account = await handler.execute(command);

      await expect(accountRepository.findOneById(account.id)).resolves.toEqual(
        expect.objectContaining({
          id: account.id,
        }),
      );
    });
  });

  describe('동일한 유저네임을 가진 계정이 존재하면', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({ username: command.username }),
      );
    });

    it('동일한 유저네임을 가진 계정이 이미 존재한다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        AccountUsernameAlreadyOccupiedError,
      );
    });
  });

  describe('동일한 닉네임을 가진 계정이 존재하면', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({ nickname: command.nickname }),
      );
    });

    it('동일한 닉네임을 가진 계정이 존재한다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(command)).rejects.toThrow(
        AccountNicknameAlreadyOccupiedError,
      );
    });
  });
});
