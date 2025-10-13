export const AWS_S3_CLIENT = Symbol('S3Client');
export const AWS_S3_PORT = Symbol('AwsS3Port');

export interface UploadFileProps {
  file: Buffer;
  key: string;
  contentType?: string;
}

export interface AwsS3Port {
  uploadFile(props: UploadFileProps): Promise<void>;
  deleteFile(key: string): Promise<void>;
}
