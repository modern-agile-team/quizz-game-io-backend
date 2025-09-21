import { Module } from '@nestjs/common';

import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/game-room-socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, GameRoomSocketEventPublisherModule],
  providers: [GameRoomClosedHandler],
})
export class GameRoomStartingModule {}
