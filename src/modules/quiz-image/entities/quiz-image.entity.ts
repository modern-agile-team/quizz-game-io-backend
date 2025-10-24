import { TSID } from 'tsid-ts';

import { QuizImageCreatedEvent } from '@module/quiz-image/events/quiz-image-created.event';
import { QuizImageDeletedEvent } from '@module/quiz-image/events/quiz-image-deleted.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface QuizImageProps {
  category: string;
  name: string;
  originalFileName: string;
  fileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

interface CreateQuizImageProps {
  category: string;
  name: string;
  originalFileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

export class QuizImage extends AggregateRoot<QuizImageProps> {
  constructor(props: CreateEntityProps<QuizImageProps>) {
    super(props);
  }

  static create(props: CreateQuizImageProps) {
    const id = generateEntityId();
    const date = new Date();

    const quizImage = new QuizImage({
      id,
      props: {
        category: props.category,
        name: props.name,
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

    quizImage.apply(
      new QuizImageCreatedEvent(quizImage.id, {
        category: quizImage.props.category,
        originalFileName: quizImage.props.originalFileName,
        fileName: quizImage.props.fileName,
        extension: quizImage.props.extension,
        contentLength: quizImage.props.contentLength,
        width: quizImage.props.width,
        height: quizImage.props.height,
      }),
    );

    return quizImage;
  }

  get category(): string {
    return this.props.category;
  }

  get name(): string {
    return this.props.name;
  }

  get originalFileName(): string {
    return this.props.originalFileName;
  }

  get fileName(): string {
    return this.props.fileName;
  }

  get filePath(): string {
    return process.env.AWS_S3_QUIZ_IMAGE_FILE_PATH + '/' + this.props.fileName;
  }

  get quizImageUrl(): string {
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
    this.apply(new QuizImageDeletedEvent(this.id, { quizImageId: this.id }));
  }

  public validate(): void {}
}
