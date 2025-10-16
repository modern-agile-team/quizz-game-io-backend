import { Module } from '@nestjs/common';

import { ActiveAccountStoreModule } from '@module/account/stores/active-account/active-account.store.module';
import { GetActiveAccountCountController } from '@module/account/use-cases/get-active-account-count/get-active-account-count.controller';
import { GetActiveAccountCountHandler } from '@module/account/use-cases/get-active-account-count/get-active-account-count.handler';

@Module({
  imports: [ActiveAccountStoreModule],
  controllers: [GetActiveAccountCountController],
  providers: [GetActiveAccountCountHandler],
})
export class GetActiveAccountCountModule {}
