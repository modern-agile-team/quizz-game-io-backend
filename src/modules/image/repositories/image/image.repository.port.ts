import { Image as ImageModel } from '@prisma/client';

import { Image } from '@module/image/entities/image.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const IMAGE_REPOSITORY = Symbol('IMAGE_REPOSITORY');

export interface ImageRaw extends ImageModel {}

export interface ImageFilter {}

export interface ImageOrder {}

export interface ImageRepositoryPort
  extends RepositoryPort<Image, ImageFilter, ImageOrder> {}
