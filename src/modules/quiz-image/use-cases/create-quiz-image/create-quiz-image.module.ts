import { Module } from '@nestjs/common';

import { NestjsFormDataModule } from 'nestjs-form-data';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { CreateQuizImageController } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.controller';
import { CreateQuizImageHandler } from '@module/quiz-image/use-cases/create-quiz-image/create-quiz-image.handler';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [QuizImageRepositoryModule, NestjsFormDataModule, AwsS3Module],
  controllers: [CreateQuizImageController],
  providers: [CreateQuizImageHandler],
})
export class CreateQuizImageModule {}
