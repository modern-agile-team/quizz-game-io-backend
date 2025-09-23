import { Module } from '@nestjs/common';

import { GameRoomMemberRoleChangedHandler } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventPublisherModule],
  providers: [GameRoomMemberRoleChangedHandler],
})
export class GameRoomMemberRoleChangedModule {}
