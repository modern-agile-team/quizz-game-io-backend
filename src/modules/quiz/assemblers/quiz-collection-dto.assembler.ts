import { QuizDtoAssembler } from '@module/quiz/assemblers/quiz-dto.assembler';
import { QuizCollectionDto } from '@module/quiz/dto/quiz-collection.dto';
import { Quiz } from '@module/quiz/entities/quiz.entity';

export class QuizCollectionDtoAssembler {
  static convertToDto(quizzes: Quiz[]): QuizCollectionDto {
    const dto = new QuizCollectionDto();

    dto.data = quizzes.map(QuizDtoAssembler.convertToDto);

    return dto;
  }
}
