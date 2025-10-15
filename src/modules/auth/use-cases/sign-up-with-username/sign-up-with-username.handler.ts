import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import bcrypt from 'bcrypt';

import {
  Account,
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';
import { CreateAccountWithUsernameCommand } from '@module/account/use-cases/create-account-with-username/create-account-with-username.command';
import { AuthToken } from '@module/auth/entities/auth-token.vo';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import { SignUpWithUsernameCommand } from '@module/auth/use-cases/sign-up-with-username/sign-up-with-username.command';

@CommandHandler(SignUpWithUsernameCommand)
export class SignUpWithUsernameHandler
  implements ICommandHandler<SignUpWithUsernameCommand, AuthToken>
{
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authService: IAuthTokenService,
  ) {}

  async execute(command: SignUpWithUsernameCommand): Promise<AuthToken> {
    const createAccountCommand = new CreateAccountWithUsernameCommand({
      role: AccountRole.user,
      signInType: SignInType.username,
      username: command.username,
      password: await bcrypt.hash(command.password, 10),
    });

    const account = await this.commandBus.execute<
      CreateAccountWithUsernameCommand,
      Account
    >(createAccountCommand);

    const authToken = this.authService.generateAuthToken(account);

    return authToken;
  }
}

console.log('test deploy');
