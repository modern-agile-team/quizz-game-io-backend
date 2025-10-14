import { NicknameSource as NicknameSourceModel } from '@prisma/client';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';

import { IOffsetPaginated, RepositoryPort } from '@common/base/base.repository';

export const NICKNAME_SOURCE_REPOSITORY = Symbol('NICKNAME_SOURCE_REPOSITORY');

export interface NicknameSourceRaw extends NicknameSourceModel {}

export interface NicknameSourceFilter {}

export interface NicknameSourceOrder {}

export interface FindAllNicknameSourcesOffsetPaginatedParams {
  pageInfo: {
    offset: number;
    limit: number;
  };
}

export interface NicknameSourceRepositoryPort
  extends RepositoryPort<
    NicknameSource,
    NicknameSourceFilter,
    NicknameSourceOrder
  > {
  findOneByName(name: string): Promise<NicknameSource | undefined>;
  findAllOffsetPaginated(
    params: FindAllNicknameSourcesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<NicknameSource>>;
}
