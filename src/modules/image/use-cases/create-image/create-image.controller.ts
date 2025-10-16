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
import { ImageDtoAssembler } from '@module/image/assemblers/image-dto.assembler';
import { ImageDto } from '@module/image/dto/image.dto';
import { Image } from '@module/image/entities/image.entity';
import { CreateImageCommand } from '@module/image/use-cases/create-image/create-image.command';
import { CreateImageDto } from '@module/image/use-cases/create-image/create-image.dto';

import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('image')
@Controller()
export class CreateImageController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiCreatedResponse({ type: ImageDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @FormDataRequest()
  @Post('admin/images')
  async createImageAdmin(@Body() dto: CreateImageDto) {
    const imageDimensions = imageSize(dto.file.buffer);

    const command = new CreateImageCommand({
      category: dto.category,
      buffer: dto.file.buffer,
      originalFileName: Buffer.from(dto.file.originalName, 'ascii').toString(
        'utf8',
      ),
      width: imageDimensions.width,
      height: imageDimensions.height,
      extension: imageDimensions.type as string,
      contentLength: String(dto.file.size),
    });

    const image = await this.commandBus.execute<CreateImageCommand, Image>(
      command,
    );

    return ImageDtoAssembler.convertToDto(image);
  }
}
