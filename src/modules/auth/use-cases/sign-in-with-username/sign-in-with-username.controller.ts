import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

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

  /**
   * @todo 프론트엔드에서 작업 완려되면 json 응답 제거
   */
  @ApiOperation({ summary: 'username 기반 로그인' })
  @ApiCreatedResponse({
    type: AuthTokenDto,
    headers: {
      'Set-Cookie': {
        description: 'access_token=token; Path=/; HttpOnly',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [SignInInfoNotMatchedError],
  })
  @Post('sign-in/username')
  async signInWithUsername(
    @Body() body: SignInWithUsernameDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthTokenDto> {
    try {
      const command = new SignInWithUsernameCommand({
        username: body.username,
        password: body.password,
      });

      const authToken = await this.commandBus.execute<
        SignInWithUsernameCommand,
        AuthToken
      >(command);

      res.cookie('access_token', authToken.accessToken, {
        httpOnly: true,
      });

      return AuthTokenDtoAssembler.convertToDto(authToken);
    } catch (error) {
      if (error instanceof SignInInfoNotMatchedError) {
        throw new BaseHttpException(HttpStatus.UNAUTHORIZED, error);
      }

      throw error;
    }
  }
}
