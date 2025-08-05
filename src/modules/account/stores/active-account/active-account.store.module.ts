import { Module } from '@nestjs/common';

import { ActiveAccountStore } from '@module/account/stores/active-account/active-account.store';
import { ACTIVE_ACCOUNT_STORE } from '@module/account/stores/active-account/active-account.store.interface';

import { CacheModule } from '@shared/cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: ACTIVE_ACCOUNT_STORE,
      useClass: ActiveAccountStore,
    },
  ],
  exports: [ACTIVE_ACCOUNT_STORE],
})
export class ActiveAccountStoreModule {}
