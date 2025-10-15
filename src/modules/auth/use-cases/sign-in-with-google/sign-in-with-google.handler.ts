import { Inject } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';

import {
  Account,
  AccountRole,
  SocialProvider,
} from '@module/account/entities/account.entity';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { CreateAccountWithGoogleCommand } from '@module/account/use-cases/create-account-with-google/create-account-with-google.command';
import { GetAccountBySocialIdQuery } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.query';
import {
  AUTH_TOKEN_SERVICE,
  IAuthTokenService,
} from '@module/auth/services/auth-token/auth-token.service.interface';
import { SignInWithGoogleCommand } from '@module/auth/use-cases/sign-in-with-google/sign-in-with-google.command';

import { InternalServerError } from '@common/base/base.error';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(SignInWithGoogleCommand)
export class SignInWithGoogleHandler
  implements ICommandHandler<SignInWithGoogleCommand, unknown>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authService: IAuthTokenService,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: SignInWithGoogleCommand): Promise<unknown> {
    let account: Account | undefined;

    account = await this.queryBus
      .execute<GetAccountBySocialIdQuery, Account>(
        new GetAccountBySocialIdQuery({
          provider: SocialProvider.google,
          providerUid: command.uid,
        }),
      )
      .catch((error) => {
        if (error instanceof AccountNotFoundError) {
          return undefined;
        }

        throw new InternalServerError();
      });

    if (account === undefined) {
      account = await this.commandBus.execute<
        CreateAccountWithGoogleCommand,
        Account
      >(
        new CreateAccountWithGoogleCommand({
          role: AccountRole.user,
          socialProviderUid: command.uid,
        }),
      );
    }

    account.signIn();

    const authToken = this.authService.generateAuthToken(account);

    await this.eventStore.storeAggregateEvents(account);

    return authToken;
  }
}
