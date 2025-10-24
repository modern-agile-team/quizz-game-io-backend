import { DomainEvent } from '@common/base/base.domain-event';

interface QuizImageUpdatedEventPayload {
  category: string;
  name: string;
}

export class QuizImageUpdatedEvent extends DomainEvent<QuizImageUpdatedEventPayload> {
  readonly aggregate = 'QuizImage';
}
