import { Module } from '@nestjs/common';

import { NestjsFormDataModule } from 'nestjs-form-data';

import { ImageRepositoryModule } from '@module/image/repositories/image/image.repository.module';
import { CreateImageController } from '@module/image/use-cases/create-image/create-image.controller';
import { CreateImageHandler } from '@module/image/use-cases/create-image/create-image.handler';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [ImageRepositoryModule, NestjsFormDataModule, AwsS3Module],
  controllers: [CreateImageController],
  providers: [CreateImageHandler],
})
export class CreateImageModule {}
