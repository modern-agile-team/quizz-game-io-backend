import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface QuizProps {
  type: string;
  question?: string;
  answer: string;
  imageUrl?: string;
}

interface CreateQuizProps {
  type: string;
  question?: string;
  answer: string;
  imageUrl?: string;
}

export class Quiz extends AggregateRoot<QuizProps> {
  constructor(props: CreateEntityProps<QuizProps>) {
    super(props);
  }

  /**
   * @todo 퀴즈 생성 유즈케이스 작업 시 이벤트 추가
   */
  static create(props: CreateQuizProps) {
    const id = generateEntityId();
    const now = new Date();

    return new Quiz({
      id,
      createdAt: now,
      updatedAt: now,
      props: {
        type: props.type,
        question: props.question,
        answer: props.answer,
        imageUrl: props.imageUrl,
      },
    });
  }

  get type(): string {
    return this.props.type;
  }

  get question(): string | undefined {
    return this.props.question;
  }

  get answer(): string {
    return this.props.answer;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  public validate(): void {}
}
