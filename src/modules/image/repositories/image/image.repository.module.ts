import { Module } from '@nestjs/common';

import { ImageRepository } from '@module/image/repositories/image/image.repository';
import { IMAGE_REPOSITORY } from '@module/image/repositories/image/image.repository.port';

@Module({
  providers: [
    {
      provide: IMAGE_REPOSITORY,
      useClass: ImageRepository,
    },
  ],
  exports: [IMAGE_REPOSITORY],
})
export class ImageRepositoryModule {}
