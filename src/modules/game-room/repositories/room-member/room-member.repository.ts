import { Inject, Injectable } from '@nestjs/common';

import { RoomMember } from '@module/game-room/entities/room-member.entity';
import { RoomMemberMapper } from '@module/game-room/mappers/room-member.mapper';
import {
  RoomMemberFilter,
  RoomMemberOrder,
  RoomMemberRaw,
  RoomMemberRepositoryPort,
} from '@module/game-room/repositories/room-member/room-member.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class RoomMemberRepository
  extends BaseRepository<RoomMember, RoomMemberRaw>
  implements RoomMemberRepositoryPort
{
  protected TABLE_NAME = 'gameRoomMember';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, RoomMemberMapper);
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<RoomMemberOrder, RoomMemberFilter>,
  ): Promise<ICursorPaginated<RoomMember>> {
    throw new Error('Method not implemented.');
  }
}
