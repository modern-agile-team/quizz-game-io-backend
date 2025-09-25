import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { ListAccountsController } from '@module/account/use-cases/list-accounts/list-accounts.controller';
import { ListAccountsHandler } from '@module/account/use-cases/list-accounts/list-accounts.handler';

@Module({
  imports: [AccountRepositoryModule],
  controllers: [ListAccountsController],
  providers: [ListAccountsHandler],
})
export class ListAccountsModule {}
