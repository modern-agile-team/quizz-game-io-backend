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
import { QuizImageDtoAssembler } from '@module/quiz-image/assemblers/quiz-image-dto.assembler';
import { QuizImageDto } from '@module/quiz-image/dto/quiz-image.dto';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { QuizImageNotFoundError } from '@module/quiz-image/errors/quiz-image-not-found.error';
import { UpdateQuizImageCommand } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.command';
import { UpdateQuizImageDto } from '@module/quiz-image/use-cases/update-quiz-image/update-quiz-image.dto';
import { QuizDto } from '@module/quiz/dto/quiz.dto';

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
export class UpdateQuizImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '퀴즈 이미지 수정' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [QuizImageNotFoundError],
  })
  @ApiOkResponse({ type: QuizDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/quiz-images/:quizImageId')
  async updateQuizImage(
    @Param('quizImageId') quizImageId: string,
    @Body() body: UpdateQuizImageDto,
  ): Promise<QuizImageDto> {
    try {
      const command = new UpdateQuizImageCommand({
        quizImageId,
        name: body.name,
        category: body.category,
      });

      const quizImage = await this.commandBus.execute<
        UpdateQuizImageCommand,
        QuizImage
      >(command);

      return QuizImageDtoAssembler.convertToDto(quizImage);
    } catch (error) {
      if (error instanceof QuizImageNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
