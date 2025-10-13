import { TSID } from 'tsid-ts';

import { ImageCreatedEvent } from '@module/image/events/image-created.event';
import { ImageDeletedEvent } from '@module/image/events/image-deleted.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface ImageProps {
  category: string;
  originalFileName: string;
  fileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

interface CreateImageProps {
  category: string;
  originalFileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

export class Image extends AggregateRoot<ImageProps> {
  constructor(props: CreateEntityProps<ImageProps>) {
    super(props);
  }

  static create(props: CreateImageProps) {
    const id = generateEntityId();
    const date = new Date();

    const image = new Image({
      id,
      props: {
        category: props.category,
        originalFileName: props.originalFileName,
        fileName: `${TSID.create().number.toString()}.${props.extension}`,
        extension: props.extension,
        contentLength: props.contentLength,
        width: props.width,
        height: props.height,
      },
      createdAt: date,
      updatedAt: date,
    });

    image.apply(
      new ImageCreatedEvent(image.id, {
        category: image.props.category,
        originalFileName: image.props.originalFileName,
        fileName: image.props.fileName,
        extension: image.props.extension,
        contentLength: image.props.contentLength,
        width: image.props.width,
        height: image.props.height,
      }),
    );

    return image;
  }

  get category(): string {
    return this.props.category;
  }

  get originalFileName(): string {
    return this.props.originalFileName;
  }

  get fileName(): string {
    return this.props.fileName;
  }

  get filePath(): string {
    return process.env.AWS_S3_IMAGE_FILE_PATH + '/' + this.props.fileName;
  }

  get imageUrl(): string {
    return `${process.env.AWS_S3_URL}/${this.filePath}`;
  }

  get extension(): string {
    return this.props.extension;
  }

  get contentType(): string {
    return `image/${this.props.extension}`;
  }

  get contentLength(): string {
    return this.props.contentLength;
  }

  get width(): number {
    return this.props.width;
  }

  get height(): number {
    return this.props.height;
  }

  delete() {
    this.apply(new ImageDeletedEvent(this.id, { imageId: this.id }));
  }

  public validate(): void {}
}
