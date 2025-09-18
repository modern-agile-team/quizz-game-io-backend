import { Module } from '@nestjs/common';

import { AccountEnteredHandler } from '@module/account/events/account-entered-event/account-entered.handler';
import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [
    AccountRepositoryModule,
    SocketEventEmitterModule,
    ActiveAccountStoreModule,
  ],
  providers: [AccountEnteredHandler],
})
export class AccountEnteredModule {}
