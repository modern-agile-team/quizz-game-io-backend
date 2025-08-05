import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { EnterAccountHandler } from '@module/account/use-cases/enter-account/enter-account.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [AccountRepositoryModule, EventStoreModule],
  providers: [EnterAccountHandler],
})
export class EnterAccountModule {}
