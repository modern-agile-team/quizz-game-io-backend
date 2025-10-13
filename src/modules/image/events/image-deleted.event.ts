import { DomainEvent } from '@common/base/base.domain-event';

interface ImageDeletedEventPayload {
  imageId: string;
}

export class ImageDeletedEvent extends DomainEvent<ImageDeletedEventPayload> {
  readonly aggregate = 'Image';
}
