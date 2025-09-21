import { Module } from '@nestjs/common';

import { GameRoomMemberRoleChangedHandler } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/game-room-socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, GameRoomSocketEventPublisherModule],
  providers: [GameRoomMemberRoleChangedHandler],
})
export class GameRoomMemberRoleChangedModule {}
