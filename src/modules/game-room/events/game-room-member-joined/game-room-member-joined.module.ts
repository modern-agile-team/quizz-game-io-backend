import { Module } from '@nestjs/common';

import { GameRoomMemberJoinedHandler } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomSocketEventPublisherModule } from '@module/game-room/socket-events/publisher/game-room-socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, GameRoomSocketEventPublisherModule],
  providers: [GameRoomMemberJoinedHandler],
})
export class GameRoomMemberJoinedModule {}
