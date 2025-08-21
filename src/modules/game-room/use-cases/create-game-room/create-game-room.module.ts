import { Module } from '@nestjs/common';

import { GameRoomMemberRepositoryModule } from '@module/game-room/repositories/game-room-member/game-room-member.repository.module';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { CreateGameRoomController } from '@module/game-room/use-cases/create-game-room/create-game-room.controller';
import { CreateGameRoomHandler } from '@module/game-room/use-cases/create-game-room/create-game-room.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    GameRoomRepositoryModule,
    GameRoomMemberRepositoryModule,
    EventStoreModule,
  ],
  controllers: [CreateGameRoomController],
  providers: [CreateGameRoomHandler],
})
export class CreateGameRoomModule {}
