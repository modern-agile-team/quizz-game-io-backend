import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import {
  NICKNAME_SOURCE_REPOSITORY,
  NicknameSourceRepositoryPort,
} from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';
import { GetNicknameSourceQuery } from '@module/nickname-source/use-cases/get-source/get-source.query';

@QueryHandler(GetNicknameSourceQuery)
export class GetNicknameSourceHandler
  implements IQueryHandler<GetNicknameSourceQuery, unknown>
{
  constructor(
    @Inject(NICKNAME_SOURCE_REPOSITORY)
    private readonly nicknameSourceRepository: NicknameSourceRepositoryPort,
  ) {}

  async execute(query: GetNicknameSourceQuery): Promise<unknown> {
    const nicknameSOurce = await this.nicknameSourceRepository.findOneById(
      query.nicknameSourceId,
    );

    if (nicknameSOurce === undefined) {
      throw new NicknameSourceNotFoundError();
    }

    return nicknameSOurce;
  }
}
