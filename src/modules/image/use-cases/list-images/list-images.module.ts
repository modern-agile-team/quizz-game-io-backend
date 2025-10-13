import { Module } from '@nestjs/common';

import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import { ListImagesController } from '@module/image/use-cases/list-images/list-images.controller';
import { ListImagesHandler } from '@module/image/use-cases/list-images/list-images.handler';

@Module({
  imports: [ImageRepositoryModule],
  controllers: [ListImagesController],
  providers: [ListImagesHandler],
})
export class ListImagesModule {}
