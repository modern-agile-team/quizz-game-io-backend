import { Module } from '@nestjs/common';

import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventPublisherModule],
  providers: [GameRoomCreatedHandler],
})
export class GameRoomCreatedModule {}
