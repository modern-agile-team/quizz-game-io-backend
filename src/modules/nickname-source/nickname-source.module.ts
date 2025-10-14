import { Module } from '@nestjs/common';

import { CreateNicknameSourceModule } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.module';
import { ListNicknameSourcesModule } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.module';

@Module({
  imports: [CreateNicknameSourceModule, ListNicknameSourcesModule],
})
export class NicknameSourceModule {}
