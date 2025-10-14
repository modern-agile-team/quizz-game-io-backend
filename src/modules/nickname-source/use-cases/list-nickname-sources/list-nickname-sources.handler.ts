import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { ListNicknameSourcesQuery } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.query';

import { OffsetPage } from '@common/base/base.entity';

@QueryHandler(ListNicknameSourcesQuery)
export class ListNicknameSourcesHandler
  implements IQueryHandler<ListNicknameSourcesQuery, OffsetPage<NicknameSource>>
{
  constructor(
    @Inject(NICKNAME_SOURCE_REPOSITORY)
    private readonly nicknameSourceRepository: NicknameSourceRepositoryPort,
  ) {}

  async execute(
    query: ListNicknameSourcesQuery,
  ): Promise<OffsetPage<NicknameSource>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const result = await this.nicknameSourceRepository.findAllOffsetPaginated({
      pageInfo: {
        offset: (page - 1) * perPage,
        limit: perPage,
      },
    });

    return new OffsetPage(result.data, page, perPage, result.totalCount);
  }
}
