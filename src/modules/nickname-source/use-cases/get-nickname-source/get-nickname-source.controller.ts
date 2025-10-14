import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { NicknameSourceDtoAssembler } from '@module/nickname-source/assemblers/nickname-source-dto.assembler';
import { NicknameSourceDto } from '@module/nickname-source/dto/nickname-source.dto';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import { GetNicknameSourceQuery } from '@module/nickname-source/use-cases/get-nickname-source/get-nickname-source.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  PermissionDeniedError,
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import { AdminGuard } from '@common/guards/admin.guard';

@ApiTags('nickname-source')
@Controller()
export class GetNicknameSourceController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '닉네임 소스 조회' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [NicknameSourceNotFoundError],
  })
  @ApiOkResponse({ type: NicknameSourceDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/nickname-sources/:nicknameSourceId')
  async getNicknameSourceAdmin(
    @Param('nicknameSourceId') nicknameSourceId: string,
  ): Promise<NicknameSourceDto> {
    try {
      const query = new GetNicknameSourceQuery({ nicknameSourceId });

      const nicknameSource = await this.queryBus.execute<
        GetNicknameSourceQuery,
        NicknameSource
      >(query);

      return NicknameSourceDtoAssembler.convertToDto(nicknameSource);
    } catch (error) {
      if (error instanceof NicknameSourceNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
