import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '@nestjs-cls/transactional';

import { Account } from '@module/account/entities/account.entity';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';
import {
  INicknameSourceService,
  NICKNAME_SOURCE_SERVICE,
} from '@module/nickname-source/services/nickname-source-service/nickname-source.service.interface';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(NICKNAME_SOURCE_SERVICE)
    private readonly nicknameSourceService: INicknameSourceService,
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  @Transactional()
  async execute(command: CreateAccountCommand): Promise<Account> {
    const existingAccountByUsername =
      await this.accountRepository.findOneByUsername(command.username);

    if (existingAccountByUsername !== undefined) {
      throw new AccountUsernameAlreadyOccupiedError();
    }

    const nicknameSource = await this.nicknameSourceService.issueNickname();

    const account = Account.create({
      role: command.role,
      signInType: command.signInType,
      username: command.username,
      password: command.password,
      nickname: nicknameSource.fullname,
    });

    await this.accountRepository.insert(account);

    await this.eventStore.storeAggregateEvents(account);
    await this.eventStore.storeAggregateEvents(nicknameSource);

    return account;
  }
}
