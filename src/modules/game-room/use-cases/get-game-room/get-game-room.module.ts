import { Module } from '@nestjs/common';

import { GameRoomMemberRepositoryModule } from '@module/game-room/repositories/game-room-member/game-room-member.repository.module';
import { GameRoomRepositoryModule } from '@module/game-room/repositories/game-room/game-room.repository.module';
import { GetGameRoomHandler } from '@module/game-room/use-cases/get-game-room/get-game-room.handler';

@Module({
  imports: [GameRoomRepositoryModule, GameRoomMemberRepositoryModule],
  providers: [GetGameRoomHandler],
})
export class GetGameRoomModule {}
