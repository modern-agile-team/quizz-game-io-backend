import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import { AuthTokenDtoAssembler } from '@module/auth/assemblers/auth-token-dto.assembler';
import { AuthTokenDto } from '@module/auth/dto/auth-token.dto';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignUpWithUsernameCommand } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.command';
import { SignUpWithUsernameDto } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.dto';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('auth')
@Controller('auth')
export class SignUpWithUsernameController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'username 기반 회원가입' })
  @ApiCreatedResponse({ type: AuthTokenDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.CONFLICT]: [AccountUsernameAlreadyOccupiedError],
  })
  @Post('sign-up/username')
  async signUpWithUsername(
    @Body() body: SignUpWithUsernameDto,
  ): Promise<AuthTokenDto> {
    try {
      const command = new SignUpWithUsernameCommand({
        username: body.username,
        password: body.password,
      });

      const result = await this.commandBus.execute<
        SignUpWithUsernameCommand,
        AuthToken
      >(command);

      return AuthTokenDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof AccountUsernameAlreadyOccupiedError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
