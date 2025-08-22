import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { ListGameRoomsController } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.controller';
import { ListGameRoomsHandler } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.handler';

@Module({
  imports: [GameRoomRepositoryModule],
  controllers: [ListGameRoomsController],
  providers: [ListGameRoomsHandler],
})
export class ListGameRoomsModule {}
