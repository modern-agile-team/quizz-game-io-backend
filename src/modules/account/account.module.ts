import { Module } from '@nestjs/common';

import { AccountEnteredModule } from '@module/account/events/account-entered-event/account-entered.module';
import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';
import { CreateAccountWithGoogleModule } from '@module/account/use-cases/create-account-with-google/create-account-with-google.module';
import { CreateAccountWithUsernameModule } from '@module/account/use-cases/create-account-with-username/create-account-with-username.module';
import { EnterAccountModule } from '@module/account/use-cases/enter-account/enter-account.module';
import { GetAccountBySocialIdModule } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.module';
import { GetAccountByUsernameModule } from '@module/account/use-cases/get-account-by-username/get-account-by-username.module';
import { GetAccountModule } from '@module/account/use-cases/get-account/get-account.module';
import { GetActiveAccountCountModule } from '@module/account/use-cases/get-active-account-count/get-active-account-count.module';
import { ListAccountsModule } from '@module/account/use-cases/list-accounts/list-accounts.module';

@Module({
  imports: [
    ActiveAccountStoreModule,

    CreateAccountWithUsernameModule,
    CreateAccountWithGoogleModule,
    EnterAccountModule,
    GetAccountModule,
    GetAccountBySocialIdModule,
    GetAccountByUsernameModule,
    GetActiveAccountCountModule,
    ListAccountsModule,

    AccountEnteredModule,
  ],
})
export class AccountModule {}
