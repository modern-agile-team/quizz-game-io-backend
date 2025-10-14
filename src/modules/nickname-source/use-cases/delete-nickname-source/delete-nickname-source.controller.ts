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
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import { DeleteNicknameSourceCommand } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.command';

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
export class DeleteNicknameSourceController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '닉네임 소스 삭제' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [NicknameSourceNotFoundError],
  })
  @ApiNoContentResponse()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin/nickname-sources/:nicknameSourceId')
  async deleteNicknameSource(
    @Param('nicknameSourceId') nicknameSourceId: string,
  ): Promise<void> {
    try {
      const command = new DeleteNicknameSourceCommand({
        nicknameSourceId,
      });

      await this.commandBus.execute<
        DeleteNicknameSourceCommand,
        NicknameSource
      >(command);
    } catch (error) {
      if (error instanceof NicknameSourceNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
