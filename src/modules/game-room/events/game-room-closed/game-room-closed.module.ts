import { Module } from '@nestjs/common';

import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [SocketEventPublisherModule],
  providers: [GameRoomClosedHandler],
})
export class GameRoomClosedModule {}
