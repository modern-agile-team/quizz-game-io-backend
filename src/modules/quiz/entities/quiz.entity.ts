import { QuizCreatedEvent } from '@module/quiz/events/quiz-created.event';
import { QuizDeletedEvent } from '@module/quiz/events/quiz-deleted.event';
import { QuizUpdatedEvent } from '@module/quiz/events/quiz-updated.event';

import {
  AggregateRoot,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface QuizProps {
  type: string;
  question?: string | null;
  answer: string;
  imageFileName?: string | null;
}

interface CreateQuizProps {
  type: string;
  question?: string | null;
  answer: string;
  imageFileName?: string | null;
}

interface UpdateQuizProps {
  type?: string;
  question?: string | null;
  answer?: string;
  imageFileName?: string | null;
}

export class Quiz extends AggregateRoot<QuizProps> {
  constructor(props: CreateEntityProps<QuizProps>) {
    super(props);
  }

  static create(props: CreateQuizProps) {
    const id = generateEntityId();
    const now = new Date();

    const quiz = new Quiz({
      id,
      createdAt: now,
      updatedAt: now,
      props: {
        type: props.type,
        question: props.question,
        answer: props.answer,
        imageFileName: props.imageFileName,
      },
    });

    quiz.apply(
      new QuizCreatedEvent(id, {
        id,
        type: props.type,
        question: props.question,
        answer: props.answer,
        imageFileName: props.imageFileName,
      }),
    );

    return quiz;
  }

  get type(): string {
    return this.props.type;
  }

  get question(): string | undefined | null {
    return this.props.question;
  }

  get answer(): string {
    return this.props.answer;
  }

  get imageFileName(): string | undefined | null {
    return this.props.imageFileName;
  }

  /**
   * @todo updatedAt 갱신
   */
  update(props: UpdateQuizProps) {
    if (props.type !== undefined) {
      this.props.type = props.type;
    }

    if (props.question !== undefined) {
      this.props.question = props.question;
    }

    if (props.answer !== undefined) {
      this.props.answer = props.answer;
    }

    if (props.imageFileName !== undefined) {
      this.props.imageFileName = props.imageFileName;
    }

    this.updatedAt = new Date();

    this.apply(
      new QuizUpdatedEvent(this.id, {
        quizId: this.id,
        type: this.props.type,
        question: this.props.question,
        answer: this.props.answer,
        imageFileName: this.props.imageFileName,
      }),
    );
  }

  delete() {
    this.apply(new QuizDeletedEvent(this.id, {}));
  }

  public validate(): void {}
}
