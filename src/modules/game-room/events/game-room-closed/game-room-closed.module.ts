import { Module } from '@nestjs/common';

import { GameRoomClosedHandler } from '@module/game-room/events/game-room-closed/game-room-closed.handler';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [SocketEventEmitterModule],
  providers: [GameRoomClosedHandler],
})
export class GameRoomClosedModule {}
