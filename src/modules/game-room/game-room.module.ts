import { Module } from '@nestjs/common';

import { GameRoomClosedModule } from '@module/game-room/events/game-room-closed/game-room-closed.module';
import { GameRoomCreatedModule } from '@module/game-room/events/game-room-created/game-room-created.module';
import { GameRoomMemberJoinedModule } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.module';
import { GameRoomMemberLeftModule } from '@module/game-room/events/game-room-member-left/game-room-member-left.module';
import { GameRoomMemberRoleChangedModule } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.module';
import { CreateGameRoomModule } from '@module/game-room/use-cases/create-game-room/create-game-room.module';
import { GetGameRoomModule } from '@module/game-room/use-cases/get-game-room/get-game-room.module';
import { JoinGameRoomModule } from '@module/game-room/use-cases/join-game-room/join-game-room.module';
import { LeaveGameRoomModule } from '@module/game-room/use-cases/leave-game-room/leave-game-room.module';
import { ListGameRoomMembersModule } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.module';
import { ListGameRoomsModule } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.module';

@Module({
  imports: [
    CreateGameRoomModule,
    GetGameRoomModule,
    JoinGameRoomModule,
    LeaveGameRoomModule,
    ListGameRoomMembersModule,
    ListGameRoomsModule,

    GameRoomClosedModule,
    GameRoomCreatedModule,
    GameRoomMemberJoinedModule,
    GameRoomMemberLeftModule,
    GameRoomMemberRoleChangedModule,
  ],
})
export class GameRoomModule {}
