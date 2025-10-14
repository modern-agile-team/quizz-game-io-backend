import { Module } from '@nestjs/common';

import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import { DeleteNicknameSourceController } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.controller';
import { DeleteNicknameSourceHandler } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [NicknameSourceRepositoryModule, EventStoreModule],
  controllers: [DeleteNicknameSourceController],
  providers: [DeleteNicknameSourceHandler],
})
export class DeleteNicknameSourceModule {}
