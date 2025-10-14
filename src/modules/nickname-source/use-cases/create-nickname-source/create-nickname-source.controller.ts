import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { NicknameSourceDtoAssembler } from '@module/nickname-source/assemblers/nickname-source-dto.assembler';
import { NicknameSourceDto } from '@module/nickname-source/dto/nickname-source.dto';
import { NicknameSource } from '@module/nickname-source/entities/nickname-source.entity';
import { NicknameSourceAlreadyExistsError } from '@module/nickname-source/errors/nickname-source-already-exists.error';
import { CreateNicknameSourceCommand } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.command';
import { CreateNicknameSourceDto } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.dto';

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
export class CreateNicknameSourceController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '닉네임 소스 생성' })
  @ApiBearerAuth()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [PermissionDeniedError],
    [HttpStatus.CONFLICT]: [NicknameSourceAlreadyExistsError],
  })
  @ApiCreatedResponse({ type: NicknameSourceDto })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin/nickname-sources')
  async createNicknameSourceAdmin(
    @Body() body: CreateNicknameSourceDto,
  ): Promise<NicknameSourceDto> {
    try {
      const command = new CreateNicknameSourceCommand({
        name: body.name,
      });

      const nicknameSource = await this.commandBus.execute<
        CreateNicknameSourceCommand,
        NicknameSource
      >(command);

      return NicknameSourceDtoAssembler.convertToDto(nicknameSource);
    } catch (error) {
      if (error instanceof NicknameSourceAlreadyExistsError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
