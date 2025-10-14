import { Module } from '@nestjs/common';

import { NicknameSourceRepository } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository';
import { NICKNAME_SOURCE_REPOSITORY } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.port';

@Module({
  providers: [
    {
      provide: NICKNAME_SOURCE_REPOSITORY,
      useClass: NicknameSourceRepository,
    },
  ],
  exports: [NICKNAME_SOURCE_REPOSITORY],
})
export class NicknameSourceRepositoryModule {}
