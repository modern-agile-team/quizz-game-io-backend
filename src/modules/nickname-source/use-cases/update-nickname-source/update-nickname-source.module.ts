import { Module } from '@nestjs/common';

import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import { UpdateNicknameSourceController } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.controller';
import { UpdateNicknameSourceHandler } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [NicknameSourceRepositoryModule, EventStoreModule],
  controllers: [UpdateNicknameSourceController],
  providers: [UpdateNicknameSourceHandler],
})
export class UpdateNicknameSourceModule {}
