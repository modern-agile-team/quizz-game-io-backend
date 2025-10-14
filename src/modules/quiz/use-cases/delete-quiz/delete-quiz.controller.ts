import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import { DeleteQuizCommand } from '@module/quiz/use-cases/delete-quiz/delete-quiz.command';

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
export class DeleteQuizController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '퀴즈 삭제' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [QuizNotFoundError],
  })
  @ApiNoContentResponse()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/quizzes/:quizId')
  async deleteQuizAdmin(@Param('quizId') quizId: string): Promise<void> {
    try {
      const command = new DeleteQuizCommand({
        quizId,
      });

      await this.commandBus.execute<DeleteQuizCommand, unknown>(command);
    } catch (error) {
      if (error instanceof QuizNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
