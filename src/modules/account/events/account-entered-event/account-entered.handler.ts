import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { AccountDtoAssembler } from '@module/account/assemblers/account-dto.assembler';
import { ActiveAccountDtoAssembler } from '@module/account/assemblers/active-account-dto.assembler';
import { Account } from '@module/account/entities/account.entity';
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
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';

@AsyncApi()
export class AccountEnteredHandler {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: AccountRepositoryPort,
    @Inject(ACTIVE_ACCOUNT_STORE)
    private readonly activeAccountStore: IActiveAccountStore,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(AccountEnteredEvent.name)
  async handle(event: AccountEnteredEvent): Promise<void> {
    const [currentActiveAccountsCount, account] = await Promise.all([
      this.activeAccountStore.increment(),
      this.accountRepository.findOneById(event.aggregateId),
    ]);

    this.publishAccountChangedEvent(account as Account);
    this.publishActiveAccountChangedEvent(currentActiveAccountsCount);
  }

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '유저가 서비스에 접속',
    channel: LobbyAccountChangedSocketEvent.EVENT_NAME,
    message: { payload: LobbyAccountChangedSocketEvent },
  })
  private publishAccountChangedEvent(account: Account): void {
    const socketEvent = new LobbyAccountChangedSocketEvent(
      AccountChangedSocketEventAction.entered,
      AccountDtoAssembler.convertToSocketEventDto(account),
    );

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }

  @AsyncApiPub({
    tags: [{ name: 'lobby' }],
    description: '유저가 서비스에 접속',
    channel: LobbyActiveAccountChangedSocketEvent.EVENT_NAME,
    message: { payload: LobbyActiveAccountChangedSocketEvent },
  })
  private publishActiveAccountChangedEvent(
    currentActiveAccountsCount: number,
  ): void {
    const socketEvent = new LobbyActiveAccountChangedSocketEvent(
      ActiveAccountChangedSocketEventAction.incr,
      ActiveAccountDtoAssembler.convertToSocketEventDto(
        currentActiveAccountsCount,
      ),
    );

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
