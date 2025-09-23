import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomAccessControlModule } from '@module/game-room/services/game-room-access-control/game-room-access-control.module';
import { GetGameRoomController } from '@module/game-room/use-cases/get-game-room/get-game-room.controller';
import { GetGameRoomHandler } from '@module/game-room/use-cases/get-game-room/get-game-room.handler';

@Module({
  controllers: [GetGameRoomController],
  imports: [GameRoomAccessControlModule, GameRoomRepositoryModule],
  providers: [GetGameRoomHandler],
})
export class GetGameRoomModule {}
