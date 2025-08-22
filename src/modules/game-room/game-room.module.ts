import { Module } from '@nestjs/common';

import { GameRoomMemberJoinedModule } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.module';
import { CreateGameRoomModule } from '@module/game-room/use-cases/create-game-room/create-game-room.module';
import { JoinGameRoomModule } from '@module/game-room/use-cases/join-game-room/join-game-room.module';
import { ListGameRoomsModule } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.module';

@Module({
  imports: [
    CreateGameRoomModule,
    JoinGameRoomModule,
    ListGameRoomsModule,

    GameRoomMemberJoinedModule,
  ],
})
export class GameRoomModule {}
