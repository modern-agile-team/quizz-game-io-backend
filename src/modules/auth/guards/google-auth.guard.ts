import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return activate;
  }

  getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions | undefined {
    const req = context.switchToHttp().getRequest();
    const redirectUrl = (req.query?.redirectUrl as string | undefined)?.trim();
    const state = this.buildState({ redirectUrl });

    return {
      state,
    };
  }

  private buildState(payload: { redirectUrl?: string }) {
    const data = {
      redirectUrl: payload.redirectUrl || '',
    };

    return JSON.stringify(data);
  }
}
