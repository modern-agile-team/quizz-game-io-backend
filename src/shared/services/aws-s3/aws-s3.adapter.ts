import { Inject } from '@nestjs/common';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

import {
  AWS_S3_CLIENT,
  AwsS3Port,
  DeleteFileProps,
  S3FileType,
  UploadFileProps,
} from '@shared/services/aws-s3/aws-s3.port';

export class AwsS3Adapter implements AwsS3Port {
  private readonly BUCKET_NAME: string;
  private readonly OBJECT_PATHS: Record<S3FileType, string>;

  constructor(
    @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client,
    private readonly appConfigService: AppConfigService,
  ) {
    this.BUCKET_NAME = this.appConfigService.get<string>(
      ENV_KEY.AWS_S3_BUCKET_NAME,
    );

    this.OBJECT_PATHS = {
      quizImage: this.appConfigService.get<string>(
        ENV_KEY.AWS_S3_QUIZ_IMAGE_FILE_PATH,
      ),
    };
  }

  async uploadFile(props: UploadFileProps): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${this.OBJECT_PATHS[props.type]}/${props.fileName}`,
      Body: props.file,
      ContentType: props.contentType,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);
  }

  async deleteFile(props: DeleteFileProps): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${this.OBJECT_PATHS[props.type]}/${props.fileName}`,
    });

    await this.s3Client.send(command);
  }
}
