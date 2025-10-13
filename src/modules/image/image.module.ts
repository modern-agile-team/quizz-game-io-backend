import { Module } from '@nestjs/common';

import { CreateImageModule } from '@module/image/use-cases/create-image/create-image.module';
import { ListImagesModule } from '@module/image/use-cases/list-images/list-images.module';

@Module({
  imports: [CreateImageModule, ListImagesModule],
})
export class ImageModule {}
