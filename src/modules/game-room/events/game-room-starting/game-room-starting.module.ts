import { Module } from '@nestjs/common';

import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventPublisherModule],
  providers: [GameRoomClosedHandler],
})
export class GameRoomStartingModule {}
