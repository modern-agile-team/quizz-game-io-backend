import { QuizImageDto } from '@module/quiz-image/dto/quiz-image.dto';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';

export class QuizImageDtoAssembler {
  static convertToDto(quizImage: QuizImage): QuizImageDto {
    const dto = new QuizImageDto({
      id: quizImage.id,
      createdAt: quizImage.createdAt,
      updatedAt: quizImage.updatedAt,
    });

    dto.category = quizImage.category;
    dto.name = quizImage.name;
    dto.originalFileName = quizImage.originalFileName;
    dto.quizImageUrl = quizImage.quizImageUrl;
    dto.extension = quizImage.extension;
    dto.contentType = quizImage.contentType;
    dto.contentLength = Number(quizImage.contentLength);
    dto.width = quizImage.width;
    dto.height = quizImage.height;

    return dto;
  }
}
