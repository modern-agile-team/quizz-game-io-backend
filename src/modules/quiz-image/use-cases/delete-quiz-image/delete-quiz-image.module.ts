import { Module } from '@nestjs/common';

import { QuizImageRepositoryModule } from '@module/quiz-image/repositories/quiz-image/quiz-image.repository.module';
import { DeleteQuizImageController } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.controller';
import { DeleteQuizImageHandler } from '@module/quiz-image/use-cases/delete-quiz-image/delete-quiz-image.handler';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';

@Module({
  imports: [QuizImageRepositoryModule, AwsS3Module],
  controllers: [DeleteQuizImageController],
  providers: [DeleteQuizImageHandler],
})
export class DeleteQuizImageModule {}
