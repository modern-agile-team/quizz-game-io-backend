import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageRaw } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class QuizImageMapper extends BaseMapper {
  static toEntity(raw: QuizImageRaw): QuizImage {
    return new QuizImage({
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

  static toPersistence(entity: QuizImage): QuizImageRaw {
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
