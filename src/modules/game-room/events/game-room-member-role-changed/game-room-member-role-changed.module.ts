import { Module } from '@nestjs/common';

import { GameRoomMemberRoleChangedHandler } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.handler';

import { SocketEventEmitterModule } from '@core/socket/socket-event-emitter.module';

@Module({
  imports: [SocketEventEmitterModule],
  providers: [GameRoomMemberRoleChangedHandler],
})
export class GameRoomMemberRoleChangedModule {}
