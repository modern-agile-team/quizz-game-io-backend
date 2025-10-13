import {
  Body,
  Controller,
  HttpStatus,
  ParseArrayPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { QuizDtoAssembler } from '@module/quiz/assemblers/quiz-dto.assembler';
import { QuizDto } from '@module/quiz/dto/quiz.dto';
import { Quiz } from '@module/quiz/entities/quiz.entity';
import { CreateQuizzesCommand } from '@module/quiz/use-cases/create-quizzes/create-quizzes.command';
import { CreateQuizzesDto } from '@module/quiz/use-cases/create-quizzes/create-quizzes.dto';

import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('quiz')
@Controller()
export class CreateQuizzesController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '퀴즈 대량 생성' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiOkResponse({ type: [QuizDto] })
  @ApiBody({ type: [CreateQuizzesDto] })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('admin/quizzes')
  async createQuizzesAdmin(
    @Body(new ParseArrayPipe({ items: CreateQuizzesDto }))
    dto: CreateQuizzesDto[],
  ): Promise<QuizDto[]> {
    const command = new CreateQuizzesCommand(
      dto.map((item) => ({
        type: item.type,
        answer: item.answer,
        question: item.question,
        imageUrl: item.imageUrl,
      })),
    );

    const quizzes = await this.commandBus.execute<CreateQuizzesCommand, Quiz[]>(
      command,
    );

    return quizzes.map((quiz) => QuizDtoAssembler.convertToDto(quiz));
  }
}
