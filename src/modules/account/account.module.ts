import { Module } from '@nestjs/common';

import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';
import { GetAccountByUsernameModule } from '@module/account/use-cases/get-account-by-username/get-account-by-username.module';

@Module({
  imports: [CreateAccountModule, GetAccountByUsernameModule],
})
export class AccountModule {}
