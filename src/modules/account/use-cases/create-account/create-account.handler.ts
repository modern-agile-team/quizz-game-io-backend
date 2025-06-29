import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Account } from '@module/account/entities/account.entity';
import { AccountUsernameAlreadyOccupiedError } from '@module/account/errors/account-username-already-occupied.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { CreateAccountCommand } from '@module/account/use-cases/create-account/create-account.command';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand, Account>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
  ) {}

  async execute(command: CreateAccountCommand): Promise<Account> {
    const account = Account.create({
      role: command.role,
      signInType: command.signInType,
      username: command.username,
      password: command.password,
    });

    const existingAccount = await this.accountRepository.findOneByUsername(
      command.username,
    );

    if (existingAccount) {
      throw new AccountUsernameAlreadyOccupiedError();
    }

    await this.accountRepository.insert(account);

    return account;
  }
}
