import { Module } from '@nestjs/common';

import { GameRoomSocketEventPublisher } from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher';
import { GAME_ROOM_SOCKET_EVENT_PUBLISHER } from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

import { SocketSessionManagerModule } from '@core/socket/session-manager/socket-session.manager.module';
import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [SocketEventEmitterModule, SocketSessionManagerModule],
  providers: [
    {
      provide: GAME_ROOM_SOCKET_EVENT_PUBLISHER,
      useClass: GameRoomSocketEventPublisher,
    },
  ],
  exports: [GAME_ROOM_SOCKET_EVENT_PUBLISHER],
})
export class GameRoomSocketEventPublisherModule {}
