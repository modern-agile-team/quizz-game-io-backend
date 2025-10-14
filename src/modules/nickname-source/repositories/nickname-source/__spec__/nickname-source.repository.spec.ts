import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceRepository } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';

import { generateEntityId } from '@common/base/base.entity';
import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(NicknameSourceRepository, () => {
  let repository: NicknameSourceRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory()],
      providers: [
        {
          provide: NICKNAME_SOURCE_REPOSITORY,
          useClass: NicknameSourceRepository,
        },
      ],
    }).compile();

    repository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
  });

  describe(NicknameSourceRepository.prototype.findOneById, () => {
    let nicknameSourceId: string;

    beforeEach(() => {
      nicknameSourceId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let nicknameSource: NicknameSource;

      beforeEach(async () => {
        nicknameSource = await repository.insert(
          NicknameSourceFactory.build({ id: nicknameSourceId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(
            repository.findOneById(nicknameSourceId),
          ).resolves.toEqual(nicknameSource);
        });
      });
    });
  });

  describe(NicknameSourceRepository.prototype.findOneByName, () => {
    let nicknameSourceName: string;

    beforeEach(() => {
      nicknameSourceName = faker.string.nanoid();
    });

    describe('이름과 일치하는 닉네임 소스가 존재하는 경우', () => {
      let nicknameSource: NicknameSource;

      beforeEach(async () => {
        nicknameSource = await repository.insert(
          NicknameSourceFactory.build({ name: nicknameSourceName }),
        );
      });

      describe('닉네임 소스를 조회하면', () => {
        it('닉네임 소스를 반환돼야한다.', async () => {
          await expect(
            repository.findOneByName(nicknameSourceName),
          ).resolves.toEqual(nicknameSource);
        });
      });
    });
  });

  describe(NicknameSourceRepository.prototype.findAllOffsetPaginated, () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let nicknameSources: NicknameSource[];

    beforeEach(async () => {
      nicknameSources = await Promise.all(
        NicknameSourceFactory.buildList(5).map((nicknameSource) =>
          repository.insert(nicknameSource),
        ),
      );
    });

    describe('페이지를 조회하면', () => {
      it('페이지가 반환되어야한다.', async () => {
        await expect(
          repository.findAllOffsetPaginated({
            pageInfo: { offset: 0, limit: 2 },
          }),
        ).resolves.toEqual({
          data: expect.toSatisfyAll(
            (nicknameSource: unknown) =>
              nicknameSource instanceof NicknameSource,
          ),
          limit: expect.any(Number),
          offset: expect.any(Number),
          totalCount: expect.any(Number),
        });
      });
    });
  });
});
