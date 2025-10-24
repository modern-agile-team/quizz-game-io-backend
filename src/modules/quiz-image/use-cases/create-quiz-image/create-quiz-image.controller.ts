import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import imageSize from 'image-size';
import { FormDataRequest } from 'nestjs-form-data';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { QuizImageDtoAssembler } from '@module/quiz-image/assemblers/quiz-image-dto.assembler';
import { QuizImageDto } from '@module/quiz-image/dto/quiz-image.dto';
import { QuizImage } from '@module/quiz-image/entities/quiz-image.entity';
import { CreateQuizImageCommand } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.command';
import { CreateQuizImageDto } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.dto';

import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('quiz-image')
@Controller()
export class CreateQuizImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '퀴즈 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiCreatedResponse({ type: QuizImageDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @FormDataRequest()
  @Post('admin/quiz-images')
  async createQuizImageAdmin(@Body() dto: CreateQuizImageDto) {
    const quizImageDimensions = imageSize(dto.file.buffer);

    const command = new CreateQuizImageCommand({
      category: dto.category,
      buffer: dto.file.buffer,
      originalFileName: Buffer.from(dto.file.originalName, 'ascii').toString(
        'utf8',
      ),
      width: quizImageDimensions.width,
      height: quizImageDimensions.height,
      extension: quizImageDimensions.type as string,
      contentLength: String(dto.file.size),
    });

    const quizImage = await this.commandBus.execute<
      CreateQuizImageCommand,
      QuizImage
    >(command);

    return QuizImageDtoAssembler.convertToDto(quizImage);
  }
}
