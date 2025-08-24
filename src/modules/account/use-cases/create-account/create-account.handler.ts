import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Account } from '@module/account/entities/account.entity';
import { AccountNicknameAlreadyOccupiedError } from '@module/account/errors/account-nickname-already-occupied.error';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';

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
    @Inject(EVENT_STORE) private readonly eventStore: IEventStore,
  ) {}

  async execute(command: CreateAccountCommand): Promise<Account> {
    const existingAccountByUsername =
      await this.accountRepository.findOneByUsername(command.username);

    if (existingAccountByUsername !== undefined) {
      throw new AccountUsernameAlreadyOccupiedError();
    }

    if (command.nickname !== undefined) {
      const existingAccountByNickname =
        await this.accountRepository.findOneByNickname(command.nickname);

      if (existingAccountByNickname !== undefined) {
        throw new AccountNicknameAlreadyOccupiedError();
      }
    }

    const account = Account.create({
      role: command.role,
      signInType: command.signInType,
      username: command.username,
      password: command.password,
      nickname: command.nickname,
    });

    await this.accountRepository.insert(account);

    await this.eventStore.storeAggregateEvents(account);

    return account;
  }
}
