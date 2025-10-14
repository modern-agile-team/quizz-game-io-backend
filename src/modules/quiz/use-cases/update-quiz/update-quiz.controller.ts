import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
import { QuizImageNotFoundError } from '@module/quiz/errors/quiz-image-not-found.error';
import { QuizNotFoundError } from '@module/quiz/errors/quiz-not-found.error';
import { UpdateQuizCommand } from '@module/quiz/use-cases/update-quiz/update-quiz.command';
import { UpdateQuizDto } from '@module/quiz/use-cases/update-quiz/update-quiz.dto';

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
export class UpdateQuizController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '퀴즈 수정' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError, QuizImageNotFoundError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [QuizNotFoundError],
  })
  @ApiOkResponse({ type: QuizDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/quizzes/:quizId')
  async updateQuizAdmin(
    @Param('quizId') quizId: string,
    @Body() body: UpdateQuizDto,
  ): Promise<QuizDto> {
    try {
      const command = new UpdateQuizCommand({
        quizId,
        type: body.type,
        answer: body.answer,
        question: body.question,
        imageUrl: body.imageUrl,
      });

      const quiz = await this.commandBus.execute<UpdateQuizCommand, Quiz>(
        command,
      );

      return QuizDtoAssembler.convertToDto(quiz);
    } catch (error) {
      if (error instanceof QuizNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }
      if (error instanceof QuizImageNotFoundError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
