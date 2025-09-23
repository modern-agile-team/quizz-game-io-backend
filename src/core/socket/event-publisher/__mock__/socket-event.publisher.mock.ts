import { Module } from '@nestjs/common';

import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

@Module({
  providers: [
    {
      provide: SOCKET_EVENT_PUBLISHER,
      useValue: MockSocketEventPublisherModule.build(),
    },
  ],
  exports: [SOCKET_EVENT_PUBLISHER],
})
export class MockSocketEventPublisherModule {
  static build(): ISocketEventPublisher {
    return {
      publishToLobby: jest.fn(),
      publishToGameRoom: jest.fn(),
      joinAndPublishToGameRoom: jest.fn(),
      leaveAndPublishToGameRoom: jest.fn(),
    };
  }
}
