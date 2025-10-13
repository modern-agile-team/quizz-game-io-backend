import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Image } from '@module/image/entities/image.entity';
import {
  IMAGE_REPOSITORY,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';
import { ListImagesQuery } from '@module/image/use-cases/list-images/list-images.query';

import { OffsetPage } from '@common/base/base.entity';

@QueryHandler(ListImagesQuery)
export class ListImagesHandler
  implements IQueryHandler<ListImagesQuery, OffsetPage<Image>>
{
  constructor(
    @Inject(IMAGE_REPOSITORY)
    private readonly imageRepository: ImageRepositoryPort,
  ) {}

  async execute(query: ListImagesQuery): Promise<OffsetPage<Image>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const result = await this.imageRepository.findAllOffsetPaginated({
      pageInfo: {
        offset: (page - 1) * perPage,
        limit: perPage,
      },
      filter: {
        category: query.category,
      },
    });

    return new OffsetPage(result.data, page, perPage, result.totalCount);
  }
}
