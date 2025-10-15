import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { CreateAccountWithGoogleHandler } from '@module/account/use-cases/create-account-with-google/create-account-with-google.handler';
import { NicknameSourceServiceModule } from '@module/nickname-source/services/nickname-source-service/nickname-source.service.module';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    AccountRepositoryModule,
    NicknameSourceServiceModule,
    EventStoreModule,
  ],
  providers: [CreateAccountWithGoogleHandler],
})
export class CreateAccountWithGoogleModule {}
