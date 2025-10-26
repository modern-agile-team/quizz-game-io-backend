import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizRaw } from '@module/quiz/repositories/quiz/quiz.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class QuizMapper extends BaseMapper {
  static toEntity(raw: QuizRaw): Quiz {
    return new Quiz({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        type: raw.type,
        answer: raw.answer,
        question: raw.question ?? undefined,
        imageFileName: raw.imageFileName ?? undefined,
      },
    });
  }

  static toPersistence(entity: Quiz): QuizRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      type: entity.type,
      answer: entity.answer,
      question: entity.question ?? null,
      imageFileName: entity.imageFileName ?? null,
    };
  }
}
