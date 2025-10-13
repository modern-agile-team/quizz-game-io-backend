import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { ImageCollectionDtoAssembler } from '@module/image/assemblers/image-collection-dto.assembler';
import { ImageDto } from '@module/image/dto/image.dto';
import { Image } from '@module/image/entities/image.entity';
import { ListImagesDto } from '@module/image/use-cases/list-images/list-images.dto';
import { ListImagesQuery } from '@module/image/use-cases/list-images/list-images.query';

import { OffsetPage } from '@common/base/base.entity';
import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('image')
@Controller()
export class ListImagesController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '이미지 리스트 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiOkResponse({ type: ImageDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/images')
  async listImagesAdmin(@Query() dto: ListImagesDto) {
    const query = new ListImagesQuery({
      category: dto.category,
      page: dto.page,
      perPage: dto.perPage,
    });

    const offsetPage = await this.queryBus.execute<
      ListImagesQuery,
      OffsetPage<Image>
    >(query);

    return ImageCollectionDtoAssembler.convertToDto(offsetPage);
  }
}
