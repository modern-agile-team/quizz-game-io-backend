import { Image as ImageModel } from '@prisma/client';

import { Image } from '@module/image/entities/image.entity';

import { IOffsetPaginated, RepositoryPort } from '@common/base/base.repository';

export const IMAGE_REPOSITORY = Symbol('IMAGE_REPOSITORY');

export interface ImageRaw extends ImageModel {}

export interface ImageFilter {
  category?: string;
}

export interface ImageOrder {}

export interface FindAllImagesOffsetPaginatedParams {
  pageInfo: {
    offset: number;
    limit: number;
  };
  filter?: ImageFilter;
}

export interface ImageRepositoryPort
  extends RepositoryPort<Image, ImageFilter, ImageOrder> {
  findAllOffsetPaginated(
    params: FindAllImagesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<Image>>;
}
