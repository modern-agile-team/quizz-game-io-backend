import { DomainEvent } from '@common/base/base.domain-event';

interface QuizDeletedEventPayload {}

export class QuizDeletedEvent extends DomainEvent<QuizDeletedEventPayload> {
  readonly aggregate = 'Quiz';
}
