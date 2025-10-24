import {
  Controller,
  Delete,
  HttpCode,
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
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import { DeleteQuizImageCommand } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('quiz-image')
@Controller()
export class DeleteQuizImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '퀴즈 이미지 제거' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [QuizImageNotFoundError],
  })
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/quiz-images/:quizImageId')
  async deleteQuizImage(@Param('quizImageId') quizImageId: string) {
    try {
      const command = new DeleteQuizImageCommand({
        quizImageId,
      });

      await this.commandBus.execute<DeleteQuizImageCommand, void>(command);
    } catch (error) {
      if (error instanceof QuizImageNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
