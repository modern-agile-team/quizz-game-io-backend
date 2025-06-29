import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthTokenDtoAssembler } from '@module/auth/assemblers/auth-token-dto.assembler';
import { AuthTokenDto } from '@module/auth/dto/auth-token.dto';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { SignInInfoNotMatchedError } from '@module/auth/errors/sign-in-info-not-matched.error';
import { SignInWithUsernameCommand } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.command';
import { SignInWithUsernameDto } from '@module/auth/use-cases/sign-in-with-username/sign-in-with-username.dto';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('auth')
@Controller('auth')
export class SignInWithUsernameController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'username 기반 로그인' })
  @ApiCreatedResponse({ type: AuthTokenDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [SignInInfoNotMatchedError],
  })
  @Post('sign-in/username')
  async signInWithUsername(
    @Body() body: SignInWithUsernameDto,
  ): Promise<AuthTokenDto> {
    try {
      const command = new SignInWithUsernameCommand({
        username: body.username,
        password: body.password,
      });

      const result = await this.commandBus.execute<
        SignInWithUsernameCommand,
        AuthToken
      >(command);

      return AuthTokenDtoAssembler.convertToDto(result);
    } catch (error) {
      if (error instanceof SignInInfoNotMatchedError) {
        throw new BaseHttpException(HttpStatus.UNAUTHORIZED, error);
      }

      throw error;
    }
  }
}
