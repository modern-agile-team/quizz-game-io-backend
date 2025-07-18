import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Account } from '@module/account/entities/account.entity';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import { IAuthTokenService } from '@module/auth/services/auth-token/auth-token.service.interface';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

@Injectable()
export class AuthTokenService implements IAuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  generateAuthToken(account: Account): AuthToken {
    const payload = { sub: account.id, role: account.role.toLowerCase() };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.appConfigService.get(ENV_KEY.JWT_ACCESS_TOKEN_EXPIRES_IN),
    });

    const authToken = new AuthToken({
      accountId: account.id,
      accessToken,
    });

    return authToken;
  }
}
