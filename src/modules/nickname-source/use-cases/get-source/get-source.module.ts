import { Module } from '@nestjs/common';

import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import { GetNicknameSourceController } from '@module/nickname-source/use-cases/get-source/get-source.controller';
import { GetNicknameSourceHandler } from '@module/nickname-source/use-cases/get-source/get-source.handler';

@Module({
  imports: [NicknameSourceRepositoryModule],
  controllers: [GetNicknameSourceController],
  providers: [GetNicknameSourceHandler],
})
export class GetNicknameSourceModule {}
