import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { CreateAccountWithUsernameHandler } from '@module/account/use-cases/create-account-with-username/create-account-with-username.handler';
import { NicknameSourceServiceModule } from '@module/nickname-source/services/nickname-source-service/nickname-source.service.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    NicknameSourceServiceModule,
    AccountRepositoryModule,
    EventStoreModule,
  ],
  providers: [CreateAccountWithUsernameHandler],
})
export class CreateAccountWithUsernameModule {}
