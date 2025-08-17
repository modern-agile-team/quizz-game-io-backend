import { Module } from '@nestjs/common';

import { CreateGameRoomModule } from '@module/game-room/use-cases/create-game-room/create-game-room.module';

@Module({
  imports: [CreateGameRoomModule],
})
export class GameRoomModule {}
