import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomAccessControlModule } from '@module/game-room/services/game-room-access-control/game-room-access-control.module';
import { StartGameController } from '@module/game-room/use-cases/start-game/start-game.controller';
import { StartGameHandler } from '@module/game-room/use-cases/start-game/start-game.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    GameRoomRepositoryModule,
    EventStoreModule,
    GameRoomAccessControlModule,
  ],
  controllers: [StartGameController],
  providers: [StartGameHandler],
})
export class StartGameModule {}
