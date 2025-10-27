import { QuizDto } from '@module/quiz/dto/quiz.dto';
import { Quiz } from '@module/quiz/entities/quiz.entity';

import { AssetUrlCodec } from '@shared/asset/asset-url.codec';

export class QuizDtoAssembler {
  static convertToDto(quiz: Quiz): QuizDto {
    const dto = new QuizDto({
      id: quiz.id,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });

    dto.type = quiz.type;
    dto.question = quiz.question ?? null;
    dto.answer = quiz.answer;
    dto.imageUrl =
      quiz.imageFileName === null || quiz.imageFileName === undefined
        ? null
        : AssetUrlCodec.fileNameToUrl(quiz.imageFileName, 'quizImage');

    return dto;
  }
}
