import { Module } from '@nestjs/common';

import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import { DeleteImageController } from '@module/image/use-cases/delete-image/delete-image.controller';
import { DeleteImageHandler } from '@module/image/use-cases/delete-image/delete-image.handler';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [ImageRepositoryModule, AwsS3Module],
  controllers: [DeleteImageController],
  providers: [DeleteImageHandler],
})
export class DeleteImageModule {}
