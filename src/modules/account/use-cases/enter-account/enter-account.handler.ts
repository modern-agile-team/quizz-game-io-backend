import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import { EnterAccountCommand } from '@module/account/use-cases/enter-account/enter-account.command';

import {
  EVENT_STORE,
  IEventStore,
} from '@core/event-sourcing/event-store.interface';

@CommandHandler(EnterAccountCommand)
export class EnterAccountHandler
  implements ICommandHandler<EnterAccountCommand, unknown>
{
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(EVENT_STORE)
    private readonly eventStore: IEventStore,
  ) {}

  async execute(command: EnterAccountCommand): Promise<unknown> {
    const { accountId } = command;

    const existingAccount = await this.accountRepository.findOneById(accountId);

    if (existingAccount === undefined) {
      throw new AccountNotFoundError();
    }

    existingAccount.enter();

    await this.accountRepository.update(existingAccount);

    await this.eventStore.storeAggregateEvents(existingAccount);

    return existingAccount;
  }
}
