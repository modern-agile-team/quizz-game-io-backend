import { Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AccountEnteredEvent } from '@module/account/events/account-entered-event/account-entered.event';
import { AccountEnteredSocketEvent } from '@module/account/socket-events/account-entered-socket.event';
import {
  ACTIVE_ACCOUNT_STORE,
  IActiveAccountStore,
} from '@module/account/stores/active-account/active-account.store.interface';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';

export class AccountEnteredHandler {
  private logger = new Logger(AccountEnteredHandler.name);

  constructor(
    @Inject(ACTIVE_ACCOUNT_STORE)
    private readonly activeAccountStore: IActiveAccountStore,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @OnEvent(AccountEnteredEvent.name)
  async handle(event: AccountEnteredEvent): Promise<void> {
    const currentActiveAccountsCount =
      await this.activeAccountStore.increment();

    const socketEvent = new AccountEnteredSocketEvent({
      account: {
        id: event.aggregateId,
        nickname: event.eventPayload.nickname,
        enteredAt: event.eventPayload.enteredAt,
      },
      currentActiveAccountsCount,
    });

    this.socketEmitter.emitToNamespace(WS_NAMESPACE.ROOT, socketEvent);
  }
}
