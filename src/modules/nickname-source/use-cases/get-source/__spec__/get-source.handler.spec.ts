import { Test, TestingModule } from '@nestjs/testing';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { GetNicknameSourceQueryFactory } from '@module/nickname-source/use-cases/get-source/__spec__/get-source-query.factory';
import { GetNicknameSourceHandler } from '@module/nickname-source/use-cases/get-source/get-source.handler';
import { GetNicknameSourceQuery } from '@module/nickname-source/use-cases/get-source/get-source.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(GetNicknameSourceHandler.name, () => {
  let handler: GetNicknameSourceHandler;

  let nicknameSourceRepository: NicknameSourceRepositoryPort;

  let query: GetNicknameSourceQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), NicknameSourceRepositoryModule],
      providers: [GetNicknameSourceHandler],
    }).compile();

    handler = module.get<GetNicknameSourceHandler>(GetNicknameSourceHandler);

    nicknameSourceRepository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = GetNicknameSourceQueryFactory.build();
  });

  describe('닉네임 소스를 조회하면', () => {
    beforeEach(async () => {
      await nicknameSourceRepository.insert(
        NicknameSourceFactory.build({ id: query.nicknameSourceId }),
      );
    });

    it('닉네임 소스가 반환되어야한다.', async () => {
      await expect(handler.execute(query)).resolves.toEqual(
        expect.objectContaining({
          id: query.nicknameSourceId,
        }),
      );
    });
  });

  describe('닉네임 소스가 존재하지 않는 경우', () => {
    it('닉네임 소스가 존재하지 않는다는 에러가 발생해야한다.', async () => {
      await expect(handler.execute(query)).rejects.toThrow(
        NicknameSourceNotFoundError,
      );
    });
  });
});
