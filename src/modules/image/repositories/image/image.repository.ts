import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { Image } from '@module/image/entities/image.entity';
import { ImageMapper } from '@module/image/mappers/image.mapper';
import {
  ImageFilter,
  ImageOrder,
  ImageRaw,
  ImageRepositoryPort,
} from '@module/image/repositories/image/image.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
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

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<ImageOrder, ImageFilter>,
  ): Promise<ICursorPaginated<Image>> {
    throw new Error('Method not implemented.');
  }
}
