import { DomainEvent } from '@common/base/base.domain-event';

interface NicknameSourceCreatedEventPayload {
  nicknameSourceId: string;
  name: string;
  sequence: number;
}

export class NicknameSourceCreatedEvent extends DomainEvent<NicknameSourceCreatedEventPayload> {
  readonly aggregate = 'NicknameSource';
}
