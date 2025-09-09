import { Module } from '@nestjs/common';

import { GameRoomCreatedHandler } from '@module/game-room/events/game-room-created/game-room-created.handler';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [SocketEventEmitterModule],
  providers: [GameRoomCreatedHandler],
})
export class GameRoomCreatedModule {}
