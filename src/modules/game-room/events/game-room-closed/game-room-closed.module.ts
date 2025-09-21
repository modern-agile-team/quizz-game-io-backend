import { Module } from '@nestjs/common';

import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';
import { GameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/game-room-socket-event-publisher.module';

@Module({
  imports: [GameRoomSocketEventPublisherModule],
  providers: [GameRoomClosedHandler],
})
export class GameRoomClosedModule {}
