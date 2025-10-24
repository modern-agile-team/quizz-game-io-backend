import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { QuizImageCollectionDtoAssembler } from '@module/quiz-image/assemblers/quiz-image-collection-dto.assembler';
import { QuizImageCollectionDto } from '@module/quiz-image/dto/quiz-image.collection.dto';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { ListQuizImagesDto } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.dto';
import { ListQuizImagesQuery } from '@module/quiz-image/use-cases/list-quiz-images/list-quiz-images.query';

import { OffsetPage } from '@common/base/base.entity';
import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('quiz-image')
@Controller()
export class ListQuizImagesController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '퀴즈 이미지 리스트 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiOkResponse({ type: QuizImageCollectionDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/quiz-images')
  async listQuizImagesAdmin(@Query() dto: ListQuizImagesDto) {
    const query = new ListQuizImagesQuery({
      category: dto.category,
      page: dto.page,
      perPage: dto.perPage,
    });

    const offsetPage = await this.queryBus.execute<
      ListQuizImagesQuery,
      OffsetPage<QuizImage>
    >(query);

    return QuizImageCollectionDtoAssembler.convertToDto(offsetPage);
  }
}
