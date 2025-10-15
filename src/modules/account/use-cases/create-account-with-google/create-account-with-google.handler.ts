import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import {
  Account,
  SocialProvider,
} from '@module/account/entities/account.entity';
import { SocialAccountAlreadyExistsError } from '@module/account/errors/social-account-already-exists.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountWithGoogleCommand } from '@module/account/use-cases/create-account-with-google/create-account-with-google.command';
import {
  INicknameSourceService,
  NICKNAME_SOURCE_SERVICE,
} from '@module/nickname-source/services/nickname-source-service/nickname-source.service.interface';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateAccountWithGoogleCommand)
export class CreateAccountWithGoogleHandler
  implements ICommandHandler<CreateAccountWithGoogleCommand, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(NICKNAME_SOURCE_SERVICE)
    private readonly nicknameSourceService: INicknameSourceService,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: CreateAccountWithGoogleCommand): Promise<Account> {
    const existingAccountByGoogle =
      await this.accountRepository.findOneBySocialId(
        SocialProvider.google,
        command.socialProviderUid,
      );

    if (existingAccountByGoogle !== undefined) {
      throw new SocialAccountAlreadyExistsError();
    }

    const nicknameSource = await this.nicknameSourceService.issueNickname();

    const account = Account.createAccountWithGoogle({
      role: command.role,
      socialProviderUid: command.socialProviderUid,
      nickname: nicknameSource.fullname,
    });

    await this.accountRepository.insert(account);

    await this.eventStore.storeAggregateEvents(account);
    await this.eventStore.storeAggregateEvents(nicknameSource);

    return account;
  }
}
