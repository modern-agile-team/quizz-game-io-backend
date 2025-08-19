import { Module } from '@nestjs/common';

import { CreateGameRoomModule } from '@module/game-room/use-cases/create-game-room/create-game-room.module';
import { JoinGameRoomModule } from '@module/game-room/use-cases/join-game-room/join-game-room.module';

@Module({
  imports: [CreateGameRoomModule, JoinGameRoomModule],
})
export class GameRoomModule {}
