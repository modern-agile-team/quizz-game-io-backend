import { Module } from '@nestjs/common';

import { GameRoomMemberLeftHandler } from '@module/game-room/events/game-room-member-left/game-room-member-left.handler';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';

import { SocketEventPublisherModule } from '@core/socket/event-publisher/socket-event-publisher.module';

@Module({
  imports: [GameRoomRepositoryModule, SocketEventPublisherModule],
  providers: [GameRoomMemberLeftHandler],
})
export class GameRoomMemberLeftModule {}
