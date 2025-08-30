import { Module } from '@nestjs/common';

import { GameRoomMemberJoinedHandler } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketSessionManagerModule } from '@core/socket/session-manager/socket-session.manager.module';
import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [
    GameRoomRepositoryModule,
    SocketEventEmitterModule,
    SocketSessionManagerModule,
  ],
  providers: [GameRoomMemberJoinedHandler],
})
export class GameRoomMemberJoinedModule {}
