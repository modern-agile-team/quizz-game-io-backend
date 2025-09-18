import { Module } from '@nestjs/common';

import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GameRoomAccessControlModule } from '@module/game-room/services/game-room-access-control/game-room-access-control.module';
import { ListGameRoomMembersController } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.controller';
import { ListGameRoomMembersHandler } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.handler';

@Module({
  imports: [GameRoomAccessControlModule, GameRoomRepositoryModule],
  controllers: [ListGameRoomMembersController],
  providers: [ListGameRoomMembersHandler],
})
export class ListGameRoomMembersModule {}
