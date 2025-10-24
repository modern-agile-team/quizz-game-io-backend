import { DomainEvent } from '@common/base/base.domain-event';

interface QuizImageCreatedEventPayload {
  category: string;
  name: string;
  originalFileName: string;
  fileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

export class QuizImageCreatedEvent extends DomainEvent<QuizImageCreatedEventPayload> {
  readonly aggregate = 'QuizImage';
}
