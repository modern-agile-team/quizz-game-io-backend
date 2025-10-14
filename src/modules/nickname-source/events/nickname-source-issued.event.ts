import { DomainEvent } from '@common/base/base.domain-event';

interface NicknameSourceIssuedEventPayload {
  nicknameSourceId: string;
  name: string;
  sequence: number;
}

export class NicknameSourceIssuedEvent extends DomainEvent<NicknameSourceIssuedEventPayload> {
  readonly aggregate = 'NicknameSource';
}
