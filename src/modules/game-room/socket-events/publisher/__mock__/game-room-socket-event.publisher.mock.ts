import { Module } from '@nestjs/common';

import {
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

@Module({
  providers: [
    {
      provide: GAME_ROOM_SOCKET_EVENT_PUBLISHER,
      useValue: MockGameRoomSocketEventPublisherModule.build(),
    },
  ],
  exports: [GAME_ROOM_SOCKET_EVENT_PUBLISHER],
})
export class MockGameRoomSocketEventPublisherModule {
  static build(): IGameRoomSocketEventPublisher {
    return {
      publishToLobby: jest.fn(),
      publishToGameRoom: jest.fn(),
      joinAndPublishToGameRoom: jest.fn(),
      leaveAndPublishToGameRoom: jest.fn(),
    };
  }
}
