import { Inject } from '@nestjs/common';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { ENV_KEY } from '@common/app-config/app-config.constant';
import { AppConfigService } from '@common/app-config/app-config.service';

import {
  AWS_S3_CLIENT,
  AwsS3Port,
  UploadFileProps,
} from '@shared/services/aws-s3/aws-s3.port';

export class AwsS3Adapter implements AwsS3Port {
  private readonly BUCKET_NAME: string;

  constructor(
    @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client,
    private readonly appConfigService: AppConfigService,
  ) {
    this.BUCKET_NAME = this.appConfigService.get<string>(
      ENV_KEY.AWS_S3_BUCKET_NAME,
    );
  }

  async uploadFile(props: UploadFileProps): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: props.key,
      Body: props.file,
      ContentType: props.contentType,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);
  }
}
