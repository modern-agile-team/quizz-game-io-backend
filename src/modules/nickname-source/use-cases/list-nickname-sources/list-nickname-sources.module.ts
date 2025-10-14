import { Module } from '@nestjs/common';

import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import { ListNicknameSourcesController } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.controller';
import { ListNicknameSourcesHandler } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.handler';

@Module({
  imports: [NicknameSourceRepositoryModule],
  controllers: [ListNicknameSourcesController],
  providers: [ListNicknameSourcesHandler],
})
export class ListNicknameSourcesModule {}
