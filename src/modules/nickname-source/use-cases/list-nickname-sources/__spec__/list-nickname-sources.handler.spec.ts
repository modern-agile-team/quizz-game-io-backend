import { Test, TestingModule } from '@nestjs/testing';

import { NicknameSourceFactory } from '@module/nickname-source/entities/__spec__/nickname-source.factory';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { ListNicknameSourcesQueryFactory } from '@module/nickname-source/use-cases/list-nickname-sources/__spec__/list-nickname-sources-query.factory';
import { ListNicknameSourcesHandler } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.handler';
import { ListNicknameSourcesQuery } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.query';

import { ClsModuleFactory } from '@common/factories/cls-module.factory';

describe(ListNicknameSourcesHandler.name, () => {
  let handler: ListNicknameSourcesHandler;

  let nicknameSourceRepository: NicknameSourceRepositoryPort;

  let query: ListNicknameSourcesQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClsModuleFactory(), NicknameSourceRepositoryModule],
      providers: [ListNicknameSourcesHandler],
    }).compile();

    handler = module.get<ListNicknameSourcesHandler>(
      ListNicknameSourcesHandler,
    );

    nicknameSourceRepository = module.get<NicknameSourceRepositoryPort>(
      NICKNAME_SOURCE_REPOSITORY,
    );
  });

  beforeEach(() => {
    query = ListNicknameSourcesQueryFactory.build();
  });

  describe('닉네임 소스 페이지를 조회하면', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let nicknameSources: NicknameSource[];

    beforeEach(async () => {
      nicknameSources = await Promise.all(
        NicknameSourceFactory.buildList(5).map((nicknameSource) =>
          nicknameSourceRepository.insert(nicknameSource),
        ),
      );
    });

    it('닉네임 소스 페이지가 반환돼야한다.', async () => {
      const result = await handler.execute(query);

      expect(result).toBeDefined();
      expect(result.data.length).toBeGreaterThanOrEqual(0);
      expect(result.currentPage).toBe(query.page ?? 1);
      expect(result.perPage).toBe(query.perPage ?? 20);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
    });
  });
});
