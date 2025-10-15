import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import {
  Account,
  SocialProvider,
} from '@module/account/entities/account.entity';
import { AccountRepository } from '@module/account/repositories/account/account.repository';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(AccountRepository, () => {
  let repository: AccountRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory()],
      providers: [
        {
          provide: ACCOUNT_REPOSITORY,
          useClass: AccountRepository,
        },
      ],
    }).compile();

    repository = module.get<AccountRepositoryPort>(ACCOUNT_REPOSITORY);
  });

  describe(AccountRepository.prototype.findOneById, () => {
    let accountId: string;

    beforeEach(() => {
      accountId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(
          AccountFactory.build({ id: accountId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(accountId)).resolves.toEqual(
            account,
          );
        });
      });
    });
  });

  describe(AccountRepository.prototype.findAllBy, () => {
    let accounts: Account[];

    beforeEach(async () => {
      accounts = await Promise.all(
        AccountFactory.buildList(3).map((account) =>
          repository.insert(account),
        ),
      );
    });

    describe('액티브 유저를 조회하면', () => {
      it('액티브 유저 목록을 반환돼야하다.', async () => {
        await expect(
          repository.findAllBy({ filter: { isActive: true } }),
        ).resolves.toSatisfyAll<Account>(
          (account) => account.isActive === true,
        );
      });
    });

    describe('모든 유저를 조회하면', () => {
      it('모든 유저 목록을 반환돼야하다.', async () => {
        await expect(repository.findAllBy({ filter: {} })).resolves.toEqual(
          expect.arrayContaining(accounts),
        );
      });
    });
  });

  describe(AccountRepository.prototype.findOneByUsername, () => {
    let username: string;

    beforeEach(() => {
      username = faker.string.nanoid(10);
    });

    describe('유저네임과 일치하는 계정이 존재하면', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(AccountFactory.build({ username }));
      });

      it('계정이 반환돼야한다.', async () => {
        await expect(repository.findOneByUsername(username)).resolves.toEqual(
          account,
        );
      });
    });

    describe('유저네임과 일치하는 계정이 존재하지 않으면', () => {
      it('undefined가 반환돼야한다.', async () => {
        await expect(
          repository.findOneByUsername(username),
        ).resolves.toBeUndefined();
      });
    });
  });

  describe(AccountRepository.prototype.findOneByNickname, () => {
    let nickname: string;

    beforeEach(() => {
      nickname = generateEntityId();
    });

    describe('넥네임과 일치하는 계정이 존재하면', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(
          AccountFactory.build({ nickname: nickname }),
        );
      });

      it('계정이 반환돼야한다.', async () => {
        await expect(repository.findOneByNickname(nickname)).resolves.toEqual(
          account,
        );
      });
    });

    describe('닉네임과 일치하는 계정이 존재하지 않으면', () => {
      it('undefined가 반환돼야한다.', async () => {
        await expect(
          repository.findOneByNickname(nickname),
        ).resolves.toBeUndefined();
      });
    });
  });

  describe(AccountRepository.prototype.findOneBySocialId, () => {
    let provider: SocialProvider;
    let providerUid: string;

    beforeEach(() => {
      provider = faker.helpers.enumValue(SocialProvider);
      providerUid = faker.string.nanoid();
    });

    describe('소셜 계정과 일치하는 계정이 존재하면', () => {
      let account: Account;

      beforeEach(async () => {
        account = await repository.insert(
          AccountFactory.build({
            socialProvider: provider,
            socialProviderUid: providerUid,
          }),
        );
      });

      it('계정이 반환돼야한다.', async () => {
        await expect(
          repository.findOneBySocialId(provider, providerUid),
        ).resolves.toEqual(account);
      });
    });

    describe('소셜 계정과 일치하는 계정이 존재하지 않으면', () => {
      it('undefined가 반환돼야한다.', async () => {
        await expect(
          repository.findOneBySocialId(provider, providerUid),
        ).resolves.toBeUndefined();
      });
    });
  });
});
