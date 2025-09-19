import { Module } from '@nestjs/common';

import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventEmitterModule],
  providers: [GameRoomClosedHandler],
})
export class GameRoomStartingModule {}
