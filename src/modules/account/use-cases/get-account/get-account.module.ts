import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetAccountHandler } from '@module/account/use-cases/get-account/get-account.handler';

@Module({
  imports: [AccountRepositoryModule],
  providers: [GetAccountHandler],
})
export class GetAccountModule {}
