import { DomainEvent } from '@common/base/base.domain-event';

interface QuizImageDeletedEventPayload {
  quizImageId: string;
}

export class QuizImageDeletedEvent extends DomainEvent<QuizImageDeletedEventPayload> {
  readonly aggregate = 'QuizImage';
}
