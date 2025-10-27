export const AWS_S3_CLIENT = Symbol('S3Client');
export const AWS_S3_PORT = Symbol('AwsS3Port');

export type S3FileType = 'quizImage';

export interface UploadFileProps {
  file: Buffer;
  type: S3FileType;
  fileName: string;
  contentType?: string;
}

export interface DeleteFileProps {
  type: S3FileType;
  fileName: string;
}

export interface AwsS3Port {
  uploadFile(props: UploadFileProps): Promise<void>;
  deleteFile(props: DeleteFileProps): Promise<void>;
}
