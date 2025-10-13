import { DomainEvent } from '@common/base/base.domain-event';

interface ImageCreatedEventPayload {
  category: string;
  originalFileName: string;
  fileName: string;
  extension: string;
  contentLength: string;
  width: number;
  height: number;
}

export class ImageCreatedEvent extends DomainEvent<ImageCreatedEventPayload> {
  readonly aggregate = 'Image';
}
