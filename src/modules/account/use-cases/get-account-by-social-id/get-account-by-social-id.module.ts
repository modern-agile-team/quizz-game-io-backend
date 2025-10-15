import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GetAccountBySocialIdHandler } from '@module/account/use-cases/get-account-by-social-id/get-account-by-social-id.handler';

@Module({
  imports: [AccountRepositoryModule],
  providers: [GetAccountBySocialIdHandler],
})
export class GetAccountBySocialIdModule {}
