import { Module } from '@nestjs/common';

import { GameRoomMemberRepositoryModule } from '@module/game-room/repositories/game-room-member/game-room-member.repository.module';
import { GameRoomAccessControlService } from '@module/game-room/services/game-room-access-control/game-room-access-control.service';
import { GAME_ROOM_ACCESS_CONTROL_SERVICE } from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';

@Module({
  imports: [GameRoomMemberRepositoryModule],
  providers: [
    {
      provide: GAME_ROOM_ACCESS_CONTROL_SERVICE,
      useClass: GameRoomAccessControlService,
    },
  ],
  exports: [GAME_ROOM_ACCESS_CONTROL_SERVICE],
})
export class GameRoomAccessControlModule {}
