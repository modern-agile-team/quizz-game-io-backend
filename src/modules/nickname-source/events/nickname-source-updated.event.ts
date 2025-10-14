import { DomainEvent } from '@common/base/base.domain-event';

interface NicknameSourceUpdatedEventPayload {
  nicknameSourceId: string;
  name?: string;
}

export class NicknameSourceUpdatedEvent extends DomainEvent<NicknameSourceUpdatedEventPayload> {
  readonly aggregate = 'NicknameSource';
}
