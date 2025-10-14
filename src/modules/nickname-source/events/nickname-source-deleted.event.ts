import { DomainEvent } from '@common/base/base.domain-event';

interface NicknameSourceDeletedEventPayload {
  nicknameSourceId: string;
}

export class NicknameSourceDeletedEvent extends DomainEvent<NicknameSourceDeletedEventPayload> {
  readonly aggregate = 'NicknameSource';
}
