import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomAccessControlModule } from '@module/game-room/services/game-room-access-control/game-room-access-control.module';
import { LeaveGameRoomController } from '@module/game-room/use-cases/leave-game-room/leave-game-room.controller';
import { LeaveGameRoomHandler } from '@module/game-room/use-cases/leave-game-room/leave-game-room.handler';

import { EventStoreModule } from '@core/event-sourcing/event-store.module';

@Module({
  imports: [
    GameRoomAccessControlModule,
    EventStoreModule,
    GameRoomRepositoryModule,
  ],
  controllers: [LeaveGameRoomController],
  providers: [LeaveGameRoomHandler],
})
export class LeaveGameRoomModule {}
