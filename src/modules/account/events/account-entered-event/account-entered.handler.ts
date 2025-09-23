import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { ActiveAccountDtoAssembler } from '@module/account/assemblers/active-account-dto.assembler';
import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { AccountEnteredEvent } from '@module/account/events/account-entered-event/account-entered.event';
import {
  ACCOUNT_REPOSITORY,
  AccountRepositoryPort,
} from '@module/account/repositories/account/account.repository.port';
import {
  AccountChangedSocketEventAction,
  LobbyAccountChangedSocketEvent,
} from '@module/account/socket-events/account-changed.socket-event';
import {
  ActiveAccountChangedSocketEventAction,
  LobbyActiveAccountChangedSocketEvent,
} from '@module/account/socket-events/active-account-changed.socket-event';
import {
  ACTIVE_ACCOUNT_STORE,
  IActiveAccountStore,
} from '@module/account/stores/active-account/active-account.store.interface';

import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

@Injectable()
export class AccountEnteredHandler {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(ACTIVE_ACCOUNT_STORE)
    private readonly activeAccountStore: IActiveAccountStore,
    @Inject(SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: ISocketEventPublisher,
  ) {}

  @OnEvent(AccountEnteredEvent.name)
  async handle(event: AccountEnteredEvent): Promise<void> {
    const [currentActiveAccountsCount, account] = await Promise.all([
      this.activeAccountStore.increment(),
      this.accountRepository.findOneById(event.aggregateId),
    ]);

    if (account === undefined) {
      throw new AccountNotFoundError();
    }

    this.eventPublisher.publishToLobby(
      new LobbyAccountChangedSocketEvent(
        AccountChangedSocketEventAction.entered,
        AccountDtoAssembler.convertToSocketEventDto(account),
      ),
    );
    this.eventPublisher.publishToLobby(
      new LobbyActiveAccountChangedSocketEvent(
        ActiveAccountChangedSocketEventAction.incr,
        ActiveAccountDtoAssembler.convertToSocketEventDto(
          currentActiveAccountsCount,
        ),
      ),
    );
  }
}
