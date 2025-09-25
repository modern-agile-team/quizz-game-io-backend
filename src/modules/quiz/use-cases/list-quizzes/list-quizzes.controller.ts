import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { QuizCollectionDtoAssembler } from '@module/quiz/assemblers/quiz-collection-dto.assembler';
import { QuizCollectionDto } from '@module/quiz/dto/quiz-collection.dto';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { ListQuizzesQuery } from '@module/quiz/use-cases/list-quizzes/list-quizzes.query';

import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('quiz')
@Controller()
export class ListQuizzesController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '퀴즈 목록 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiOkResponse({ type: QuizCollectionDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/quizzes')
  async listQuizzes() {
    const query = new ListQuizzesQuery({});

    const quizzes = await this.queryBus.execute<ListQuizzesQuery, Quiz[]>(
      query,
    );

    return QuizCollectionDtoAssembler.convertToDto(quizzes);
  }
}
