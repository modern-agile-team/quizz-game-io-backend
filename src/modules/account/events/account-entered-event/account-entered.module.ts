import { Module } from '@nestjs/common';

import { AccountEnteredHandler } from '@module/account/events/account-entered-event/account-entered.handler';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [
    AccountRepositoryModule,
    SocketEventPublisherModule,
    ActiveAccountStoreModule,
  ],
  providers: [AccountEnteredHandler],
})
export class AccountEnteredModule {}
