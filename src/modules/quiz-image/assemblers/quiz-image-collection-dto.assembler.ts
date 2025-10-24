import { QuizImageDtoAssembler } from '@module/quiz-image/assemblers/quiz-image-dto.assembler';
import { QuizImageCollectionDto } from '@module/quiz-image/dto/quiz-image.collection.dto';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';

import { OffsetPage } from '@common/base/base.entity';

export class QuizImageCollectionDtoAssembler {
  static convertToDto(page: OffsetPage<QuizImage>): QuizImageCollectionDto {
    const dto = new QuizImageCollectionDto();

    dto.data = page.data.map(QuizImageDtoAssembler.convertToDto);
    dto.currentPage = page.currentPage;
    dto.perPage = page.perPage;
    dto.totalCount = page.totalCount;
    dto.totalPages = page.totalPages;

    return dto;
  }
}
