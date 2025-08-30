import { Module } from '@nestjs/common';

import { AccountRepositoryModule } from '@module/account/repositories/account/account.repository.module';
import { GameRoomMemberRepositoryModule } from '@module/game-room/repositories/game-room-member/game-room-member.repository.module';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { JoinGameRoomController } from '@module/game-room/use-cases/join-game-room/join-game-room.controller';
import { JoinGameRoomHandler } from '@module/game-room/use-cases/join-game-room/join-game-room.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    GameRoomRepositoryModule,
    GameRoomMemberRepositoryModule,
    AccountRepositoryModule,
    EventStoreModule,
  ],
  controllers: [JoinGameRoomController],
  providers: [JoinGameRoomHandler],
})
export class JoinGameRoomModule {}
