import { Module } from '@nestjs/common';

import { CreateImageModule } from '@module/image/use-cases/create-image/create-image.module';

@Module({
  imports: [CreateImageModule],
})
export class ImageModule {}
