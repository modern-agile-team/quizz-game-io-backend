import { Module } from '@nestjs/common';

import { GameRoomMemberRoleChangedHandler } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventEmitterModule],
  providers: [GameRoomMemberRoleChangedHandler],
})
export class GameRoomMemberRoleChangedModule {}
