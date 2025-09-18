import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GetGameRoomHandler } from '@module/game-room/use-cases/get-game-room/get-game-room.handler';

@Module({
  imports: [GameRoomRepositoryModule],
  providers: [GetGameRoomHandler],
})
export class GetGameRoomModule {}
