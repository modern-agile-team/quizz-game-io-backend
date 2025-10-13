import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { Image } from '@module/image/entities/image.entity';
import { ImageMapper } from '@module/image/mappers/image.mapper';
import {
  FindAllImagesOffsetPaginatedParams,
  ImageFilter,
  ImageOrder,
  ImageRaw,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
  IOffsetPaginated,
} from '@common/base/base.repository';

@Injectable()
export class ImageRepository
  extends BaseRepository<Image, ImageRaw>
  implements ImageRepositoryPort
{
  protected TABLE_NAME = 'image';

  constructor(
    @InjectTransactionHost()
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(txHost, ImageMapper);
  }

  async findAllOffsetPaginated(
    params: FindAllImagesOffsetPaginatedParams,
  ): Promise<IOffsetPaginated<Image>> {
    const { pageInfo, filter } = params;

    const where = {};

    if (filter?.category) {
      Object.assign(where, { category: filter.category });
    }

    const images = await this.txHost.tx.image.findMany({
      skip: pageInfo.offset,
      take: pageInfo.limit,
      where,
      orderBy: this.toOrderBy([{ field: 'id', direction: 'asc' }]),
    });
    const totalCount = await this.txHost.tx.image.count({ where });

    return {
      offset: pageInfo.offset,
      limit: pageInfo.limit,
      totalCount: totalCount,
      data: images.map((image) => ImageMapper.toEntity(image)),
    };
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<ImageOrder, ImageFilter>,
  ): Promise<ICursorPaginated<Image>> {
    throw new Error('Method not implemented.');
  }
}
