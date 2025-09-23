import { Module } from '@nestjs/common';

import { GameRoomMemberJoinedHandler } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventPublisherModule],
  providers: [GameRoomMemberJoinedHandler],
})
export class GameRoomMemberJoinedModule {}
