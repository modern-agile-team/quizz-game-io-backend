import { Module } from '@nestjs/common';

import { GameRoomMemberRepository } from '@module/game-room/repositories/game-room-member/game-room-member.repository';
import { GAME_ROOM_MEMBER_REPOSITORY } from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: GAME_ROOM_MEMBER_REPOSITORY,
      useClass: GameRoomMemberRepository,
    },
  ],
  exports: [GAME_ROOM_MEMBER_REPOSITORY],
})
export class GameRoomMemberRepositoryModule {}
