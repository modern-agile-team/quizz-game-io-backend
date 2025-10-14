import { Module } from '@nestjs/common';

import { NicknameSourceRepositoryModule } from '@module/nickname-source/repositories/nickname-source/nickname-source.repository.module';
import { NicknameSourceService } from '@module/nickname-source/services/nickname-source-service/nickname-source.service';
import { NICKNAME_SOURCE_SERVICE } from '@module/nickname-source/services/nickname-source-service/nickname-source.service.interface';

@Module({
  imports: [NicknameSourceRepositoryModule],
  providers: [
    {
      provide: NICKNAME_SOURCE_SERVICE,
      useClass: NicknameSourceService,
    },
  ],
  exports: [NICKNAME_SOURCE_SERVICE],
})
export class NicknameSourceServiceModule {}
