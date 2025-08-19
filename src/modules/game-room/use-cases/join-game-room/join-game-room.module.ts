import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { RoomMemberRepositoryModule } from '@module/game-room/repositories/room-member/room-member.repository.module';
import { JoinGameRoomController } from '@module/game-room/use-cases/join-game-room/join-game-room.controller';
import { JoinGameRoomHandler } from '@module/game-room/use-cases/join-game-room/join-game-room.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    GameRoomRepositoryModule,
    RoomMemberRepositoryModule,
    EventStoreModule,
  ],
  controllers: [JoinGameRoomController],
  providers: [JoinGameRoomHandler],
})
export class JoinGameRoomModule {}
