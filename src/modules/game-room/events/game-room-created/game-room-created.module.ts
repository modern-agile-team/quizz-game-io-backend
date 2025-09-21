import { Module } from '@nestjs/common';

import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/game-room-socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, GameRoomSocketEventPublisherModule],
  providers: [GameRoomCreatedHandler],
})
export class GameRoomCreatedModule {}
