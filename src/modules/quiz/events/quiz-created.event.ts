import { DomainEvent } from '@common/base/base.domain-event';

interface QuizCreatedEventPayload {
  id: string;
  type: string;
  question?: string | null;
  answer: string;
  imageFileName?: string | null;
}

export class QuizCreatedEvent extends DomainEvent<QuizCreatedEventPayload> {
  readonly aggregate = 'Quiz';
}
