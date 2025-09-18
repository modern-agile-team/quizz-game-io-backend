import { Module } from '@nestjs/common';

import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventEmitterModule],
  providers: [GameRoomCreatedHandler],
})
export class GameRoomCreatedModule {}
