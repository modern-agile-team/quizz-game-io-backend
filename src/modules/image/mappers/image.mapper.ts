import { Image } from '@module/image/entities/image.entity';
import { ImageRaw } from '@module/image/repositories/image/image.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class ImageMapper extends BaseMapper {
  static toEntity(raw: ImageRaw): Image {
    return new Image({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        category: raw.category,
        originalFileName: raw.originalFileName,
        fileName: raw.fileName,
        extension: raw.extension,
        contentLength: raw.contentLength,
        width: raw.width,
        height: raw.height,
      },
    });
  }

  static toPersistence(entity: Image): ImageRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      category: entity.category,
      originalFileName: entity.originalFileName,
      fileName: entity.fileName,
      extension: entity.extension,
      contentLength: entity.contentLength,
      width: entity.width,
      height: entity.height,
    };
  }
}
