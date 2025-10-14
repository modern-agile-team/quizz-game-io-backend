import { Module } from '@nestjs/common';

import { CreateNicknameSourceModule } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.module';
import { GetNicknameSourceModule } from '@module/nickname-source/use-cases/get-source/get-source.module';
import { ListNicknameSourcesModule } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.module';
import { UpdateNicknameSourceModule } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.module';

@Module({
  imports: [
    CreateNicknameSourceModule,
    GetNicknameSourceModule,
    ListNicknameSourcesModule,
    UpdateNicknameSourceModule,
  ],
})
export class NicknameSourceModule {}
