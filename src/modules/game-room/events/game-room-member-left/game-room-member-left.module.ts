import { Module } from '@nestjs/common';

import { GameRoomMemberLeftHandler } from '@module/game-room/events/game-room-member-left/game-room-member-left.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketSessionManagerModule } from '@core/socket/session-manager/socket-session.manager.module';
import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [
    GameRoomRepositoryModule,
    SocketEventEmitterModule,
    SocketSessionManagerModule,
  ],
  providers: [GameRoomMemberLeftHandler],
})
export class GameRoomMemberLeftModule {}
