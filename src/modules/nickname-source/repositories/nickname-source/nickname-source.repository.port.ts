import { NicknameSource as NicknameSourceModel } from '@prisma/client';

import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';

import {
  IOffsetPaginated,
  ISort,
  RepositoryPort,
} from '@common/base/base.repository';

export const NICKNAME_SOURCE_REPOSITORY = Symbol('NICKNAME_SOURCE_REPOSITORY');

export interface NicknameSourceRaw extends NicknameSourceModel {}

export interface NicknameSourceFilter {}

export interface NicknameSourceOrder {}

export interface FindAllNicknameSourcesOffsetPaginatedParams {
  pageInfo: {
    offset: number;
    limit: number;
  };
  order?: ISort<'createdAt' | 'sequence'>[];
}

export interface NicknameSourceRepositoryPort
  extends RepositoryPort<
    NicknameSource,
    NicknameSourceFilter,
    NicknameSourceOrder
  > {
  incrementSequence(id: string): Promise<number>;
  findOneByName(name: string): Promise<NicknameSource | undefined>;
  findAllOffsetPaginated(
    params: FindAllNicknameSourcesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<NicknameSource>>;
}
