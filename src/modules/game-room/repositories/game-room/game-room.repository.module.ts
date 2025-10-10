import { Module } from '@nestjs/common';

import { GameRoomRepository } from '@module/game-room/repositories/game-room/game-room.repository';
import { GAME_ROOM_REPOSITORY } from '@module/game-room/repositories/game-room/game-room.repository.port';

@Module({
  providers: [
    {
      provide: GAME_ROOM_REPOSITORY,
      useClass: GameRoomRepository,
    },
  ],
  exports: [GAME_ROOM_REPOSITORY],
})
export class GameRoomRepositoryModule {}
