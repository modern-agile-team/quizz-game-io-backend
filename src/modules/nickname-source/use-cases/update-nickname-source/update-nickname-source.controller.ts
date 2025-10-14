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
import { NicknameSourceDtoAssembler } from '@module/nickname-source/assemblers/nickname-source-dto.assembler';
import { NicknameSourceDto } from '@module/nickname-source/dto/nickname-source.dto';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceAlreadyExistsError } from '@module/nickname-source/errors/nickname-source-already-exists.error';
import { NicknameSourceNotFoundError } from '@module/nickname-source/errors/nickname-source-not-found.error';
import { UpdateNicknameSourceCommand } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.command';
import { UpdateNicknameSourceDto } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.dto';

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
export class UpdateNicknameSourceController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '닉네임 소스 수정' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.NOT_FOUND]: [NicknameSourceNotFoundError],
    [HttpStatus.CONFLICT]: [NicknameSourceAlreadyExistsError],
  })
  @ApiOkResponse({ type: NicknameSourceDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/nickname-sources/:nicknameSourceId')
  async updateNicknameSource(
    @Param('nicknameSourceId') nicknameSourceId: string,
    @Body() body: UpdateNicknameSourceDto,
  ): Promise<NicknameSourceDto> {
    try {
      const command = new UpdateNicknameSourceCommand({
        nicknameSourceId,
        name: body.name,
      });

      const nicknameSource = await this.commandBus.execute<
        UpdateNicknameSourceCommand,
        NicknameSource
      >(command);

      return NicknameSourceDtoAssembler.convertToDto(nicknameSource);
    } catch (error) {
      if (error instanceof NicknameSourceNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }
      if (error instanceof NicknameSourceAlreadyExistsError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
