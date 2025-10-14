import { DomainEvent } from '@common/base/base.domain-event';

interface QuizUpdatedEventPayload {
  quizId: string;
  type?: string;
  question?: string | null;
  answer?: string;
  imageUrl?: string | null;
}

export class QuizUpdatedEvent extends DomainEvent<QuizUpdatedEventPayload> {
  readonly aggregate = 'Quiz';
}
