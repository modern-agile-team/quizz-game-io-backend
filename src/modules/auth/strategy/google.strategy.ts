// src/modules/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly appConfigService: AppConfigService) {
    super({
      clientID: appConfigService.get<string>(ENV_KEY.GOOGLE_OAUTH_CLIENT_ID),
      clientSecret: appConfigService.get<string>(
        ENV_KEY.GOOGLE_OAUTH_CLIENT_SECRET,
      ),
      callbackURL: appConfigService.get<string>(
        ENV_KEY.GOOGLE_OAUTH_CALLBACK_URL,
      ),
      scope: appConfigService
        .get<string>(ENV_KEY.GOOGLE_OAUTH_SCOPE)
        .split(','),
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id } = profile;

    const user = {
      provider: 'google',
      uid: id,
    };

    done(null, user);
  }
}
