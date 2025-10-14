import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { NicknameSourceCollectionDtoAssembler } from '@module/nickname-source/assemblers/nickname-source-dto-collection.assembler';
import { NicknameSourceCollectionDto } from '@module/nickname-source/dto/nickname-source-collection.dto';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { ListNicknameSourcesDto } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.dto';
import { ListNicknameSourcesQuery } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.query';

import { OffsetPage } from '@common/base/base.entity';
import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('nickname-source')
@Controller()
export class ListNicknameSourcesController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '닉네임 소스 리스트 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
  })
  @ApiOkResponse({ type: NicknameSourceCollectionDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/nickname-sources')
  async listNicknameSources(@Query() dto: ListNicknameSourcesDto) {
    const query = new ListNicknameSourcesQuery({
      page: dto.page,
      perPage: dto.perPage,
    });

    const offsetPage = await this.queryBus.execute<
      ListNicknameSourcesQuery,
      OffsetPage<NicknameSource>
    >(query);

    return NicknameSourceCollectionDtoAssembler.convertToDto(offsetPage);
  }
}
