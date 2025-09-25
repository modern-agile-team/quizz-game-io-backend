import { QuizDto } from '@module/quiz/dto/quiz.dto';
import { Quiz } from '@module/quiz/entities/quiz.entity';

export class QuizDtoAssembler {
  static convertToDto(quiz: Quiz): QuizDto {
    const dto = new QuizDto({
      id: quiz.id,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });

    dto.type = quiz.type;
    dto.question = quiz.question;
    dto.answer = quiz.answer;
    dto.imageUrl = quiz.imageUrl;

    return dto;
  }
}
