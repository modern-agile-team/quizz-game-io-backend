import { Module } from '@nestjs/common';

import { AccountEnteredModule } from '@module/account/events/account-entered-event/account-entered.module';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';
import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import { EnterAccountModule } from '@module/account/use-cases/enter-account/enter-account.module';
import { GetAccountByUsernameModule } from '@module/account/use-cases/get-account-by-username/get-account-by-username.module';
import { GetAccountModule } from '@module/account/use-cases/get-account/get-account.module';

@Module({
  imports: [
    ActiveAccountStoreModule,

    CreateAccountModule,
    EnterAccountModule,
    GetAccountModule,
    GetAccountByUsernameModule,

    AccountEnteredModule,
  ],
})
export class AccountModule {}
