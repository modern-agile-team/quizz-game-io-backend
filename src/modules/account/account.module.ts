import { Module } from '@nestjs/common';

import { CreateAccountModule } from '@module/account/use-cases/create-account/create-account.module';

@Module({
  imports: [CreateAccountModule],
})
export class AccountModule {}
