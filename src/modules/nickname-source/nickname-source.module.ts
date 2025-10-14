import { Module } from '@nestjs/common';

import { CreateNicknameSourceModule } from '@module/nickname-source/use-cases/create-nickname-source/create-nickname-source.module';

@Module({
  imports: [CreateNicknameSourceModule],
})
export class NicknameSourceModule {}
