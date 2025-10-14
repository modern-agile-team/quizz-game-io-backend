import { Module } from '@nestjs/common';

import { CreateNicknameSourceModule } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.module';
import { DeleteNicknameSourceModule } from '@module/nickname-source/use-cases/delete-nickname-source/delete-nickname-source.module';
import { GetNicknameSourceModule } from '@module/nickname-source/use-cases/get-nickname-source/get-nickname-source.module';
import { ListNicknameSourcesModule } from '@module/nickname-source/use-cases/list-nickname-sources/list-nickname-sources.module';
import { UpdateNicknameSourceModule } from '@module/nickname-source/use-cases/update-nickname-source/update-nickname-source.module';

@Module({
  imports: [
    CreateNicknameSourceModule,
    DeleteNicknameSourceModule,
    GetNicknameSourceModule,
    ListNicknameSourcesModule,
    UpdateNicknameSourceModule,
  ],
})
export class NicknameSourceModule {}
