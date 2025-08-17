import { Module } from '@nestjs/common';

import { GameRoomRepository } from '@module/game-room/repositories/game-room/game-room.repository';
import { GAME_ROOM_REPOSITORY } from '@module/game-room/repositories/game-room/game-room.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: GAME_ROOM_REPOSITORY,
      useClass: GameRoomRepository,
    },
  ],
  exports: [GAME_ROOM_REPOSITORY],
})
export class GameRoomRepositoryModule {}
