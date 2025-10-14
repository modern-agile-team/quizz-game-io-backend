import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommandFactory } from '@module/account/use-cases/create-account/__spec__/create-account-command.factory';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';
import { CreateAccountHandler } from '@module/account/use-cases/create-account/create-account.handler';
import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import {
  INicknameSourceService,
  NICKNAME_SOURCE_SERVICE,
} from '@module/nickname-source/services/nickname-source-service/nickname-source.service.interface';
import { NicknameSourceServiceModule } from '@module/nickname-source/services/nickname-source-service/nickname-source.service.module';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

describe(CreateAccountHandler.name, () => {
  let handler: CreateAccountHandler;

  let accountRepository: AccountRepositoryPort;
  let nicknameSourceService: INicknameSourceService;

  let command: CreateAccountCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        NicknameSourceServiceModule,
        ClsModuleFactory(),
        AccountRepositoryModule,
        EventStoreModule,
      ],
      providers: [CreateAccountHandler],
    }).compile();

    handler = module.get<CreateAccountHandler>(CreateAccountHandler);

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
    nicknameSourceService = module.get<INicknameSourceService>(
      NICKNAME_SOURCE_SERVICE,
    );
  });

  beforeEach(() => {
    command = CreateAccountCommandFactory.build();
  });

  let nicknameSource: NicknameSource;
  beforeEach(() => {
    nicknameSource = NicknameSourceFactory.build();
    jest
      .spyOn(nicknameSourceService, 'issueNickname')
      .mockResolvedValue(nicknameSource);
  });

  describe('계정을 생성하면', () => {
    it('계정이 생성돼야한다.', async () => {
      const account = await handler.execute(command);

      await expect(accountRepository.findOneById(account.id)).resolves.toEqual(
        expect.objectContaining({
          id: account.id,
          nickname: nicknameSource.fullname,
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
});
