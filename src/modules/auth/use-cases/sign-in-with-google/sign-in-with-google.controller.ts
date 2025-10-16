import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';

import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { GoogleAuthGuard } from '@module/auth/guards/google-auth.guard';
import { SignInWithGoogleCommand } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.command';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('auth')
@Controller()
export class SignInWithGoogleController {
  private readonly ALLOW_REDIRECT_URLS: string[];
  private readonly DEFAULT_REDIRECT_URL: string;

  constructor(
    private readonly commandBus: CommandBus,
    private readonly appConfigService: AppConfigService,
  ) {
    this.ALLOW_REDIRECT_URLS = this.appConfigService.get<string[]>(
      ENV_KEY.OAUTH_ALLOW_REDIRECT_URLS,
    );

    this.DEFAULT_REDIRECT_URL = this.appConfigService.get<string>(
      ENV_KEY.OAUTH_DEFAULT_REDIRECT_URL,
    );
  }

  @ApiErrorResponse({})
  @ApiOperation({
    summary: '구글 회원가입 로그인',
    description: '게정이 있다면 회원가입, 없다면 로그인시킵니다.',
  })
  @ApiOkResponse({
    headers: {
      'Set-Cookie': {
        description: 'access_token=token; Path=/; HttpOnly',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiQuery({
    name: 'redirectUrl',
    required: false,
    type: String,
  })
  @UseGuards(GoogleAuthGuard)
  @Get('/auth/google')
  async signInWithGoogle() {
    return;
  }

  @ApiExcludeEndpoint()
  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async signInWithGoogleCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;

    const command = new SignInWithGoogleCommand({ uid: user.uid });

    const authToken = await this.commandBus.execute<
      SignInWithGoogleCommand,
      AuthToken
    >(command);

    res.cookie('access_token', authToken.accessToken, {
      httpOnly: true,
    });

    const state = JSON.parse(req.query.state);

    const redirectUrl = this.ALLOW_REDIRECT_URLS.includes(state.redirectUrl)
      ? state.redirectUrl
      : this.DEFAULT_REDIRECT_URL;

    res.redirect(redirectUrl);
  }
}
