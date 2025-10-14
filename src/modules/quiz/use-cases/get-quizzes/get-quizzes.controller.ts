import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { QuizDtoAssembler } from '@module/quiz/assemblers/quiz-dto.assembler';
import { QuizDto } from '@module/quiz/dto/quiz.dto';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import { GetQuizzesQuery } from '@module/quiz/use-cases/get-quizzes/get-quizzes.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('quiz')
@Controller()
export class GetQuizzesController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '퀴즈 단일 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiOkResponse({ type: QuizDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/quizzes/:quizId')
  async getQuizzesAdmin(@Param('quizId') quizId: string): Promise<QuizDto> {
    try {
      const query = new GetQuizzesQuery({
        quizId,
      });

      const quiz = await this.queryBus.execute<GetQuizzesQuery, Quiz>(query);

      return QuizDtoAssembler.convertToDto(quiz);
    } catch (error) {
      if (error instanceof QuizNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
