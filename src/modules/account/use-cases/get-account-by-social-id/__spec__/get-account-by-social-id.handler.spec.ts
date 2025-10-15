import { Test, TestingModule } from '@nestjs/testing';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { GetAccountBySocialIdQueryFactory } from '@module/account/use-cases/get-account-by-social-id/__spec__/get-account-by-social-id-query.factory';
import { GetAccountBySocialIdHandler } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.handler';
import { GetAccountBySocialIdQuery } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(GetAccountBySocialIdHandler.name, () => {
  let handler: GetAccountBySocialIdHandler;

  let accountRepository: AccountRepositoryPort;

  let query: GetAccountBySocialIdQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), AccountRepositoryModule],
      providers: [GetAccountBySocialIdHandler],
    }).compile();

    handler = module.get<GetAccountBySocialIdHandler>(
      GetAccountBySocialIdHandler,
    );

    accountRepository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  beforeEach(() => {
    query = GetAccountBySocialIdQueryFactory.build();
  });

  describe('소셜 계정을 조회하면', () => {
    beforeEach(async () => {
      await accountRepository.insert(
        AccountFactory.build({
          socialProvider: query.provider,
          socialProviderUid: query.providerUid,
        }),
      );
    });

    it('소셜 계정이 반환되어야한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(
        expect.objectContaining({
          socialProvider: query.provider,
          socialProviderUid: query.providerUid,
        }),
      );
    });
  });

  describe('소셜 계정에 해당하는 계정이 존재하지 않는 경우', () => {
    it('계정이 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(query)).rejects.toThrow(
        AccountNotFoundError,
      );
    });
  });
});
