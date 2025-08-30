import { Module } from '@nestjs/common';

import { CacheModule } from '@shared/cache/cache.module';

import { AccountSocketIndexStore } from '@core/socket/index-store/account-socket-index.store';
import { ACCOUNT_SOCKET_INDEX_STORE } from '@core/socket/index-store/account-socket-index.store.interface';

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: ACCOUNT_SOCKET_INDEX_STORE,
      useClass: AccountSocketIndexStore,
    },
  ],
  exports: [ACCOUNT_SOCKET_INDEX_STORE],
})
export class AccountSocketIndexStoreModule {}
