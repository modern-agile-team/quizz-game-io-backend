import { Module } from '@nestjs/common';

import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import { CreateNicknameSourceController } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.controller';
import { CreateNicknameSourceHandler } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [NicknameSourceRepositoryModule, EventStoreModule],
  controllers: [CreateNicknameSourceController],
  providers: [CreateNicknameSourceHandler],
})
export class CreateNicknameSourceModule {}
