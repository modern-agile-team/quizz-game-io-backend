import { Module } from '@nestjs/common';

import { RoomMemberRepository } from '@module/game-room/repositories/room-member/room-member.repository';
import { ROOM_MEMBER_REPOSITORY } from '@module/game-room/repositories/room-member/room-member.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ROOM_MEMBER_REPOSITORY,
      useClass: RoomMemberRepository,
    },
  ],
  exports: [ROOM_MEMBER_REPOSITORY],
})
export class RoomMemberRepositoryModule {}
