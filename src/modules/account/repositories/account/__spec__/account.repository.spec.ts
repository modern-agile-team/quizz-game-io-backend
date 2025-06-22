import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/postgresql';

import { AccountFactory } from '@module/account/entities/__spec__/account.factory';
import { Account } from '@module/account/entities/account.entity';
import { AccountRepository } from '@module/account/repositories/account/account.repository';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';

import { generateEntityId } from '@common/base/base.entity';

describe(AccountRepository, () => {
  let repository: AccountRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EntityManager,
          useValue: global.orm.em,
        },
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
});
