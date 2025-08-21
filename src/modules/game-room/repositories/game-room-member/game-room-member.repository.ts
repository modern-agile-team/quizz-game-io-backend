import { Inject, Injectable } from '@nestjs/common';

import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberMapper } from '@module/game-room/mappers/game-room-member.mapper';
import {
  GameRoomMemberFilter,
  GameRoomMemberOrder,
  GameRoomMemberRaw,
  GameRoomMemberRepositoryPort,
} from '@module/game-room/repositories/game-room-member/game-room-member.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class GameRoomMemberRepository
  extends BaseRepository<GameRoomMember, GameRoomMemberRaw>
  implements GameRoomMemberRepositoryPort
{
  protected TABLE_NAME = 'gameRoomMember';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, GameRoomMemberMapper);
  }

  async findByAccountIdInGameRoom(
    accountId: string,
    gameRoomId: string,
  ): Promise<GameRoomMember | undefined> {
    if (isNaN(Number(accountId)) || isNaN(Number(gameRoomId))) {
      return;
    }

    const raw = await this.prismaService.gameRoomMember.findUnique({
      where: {
        accountId_gameRoomId: {
          accountId: this.mapper.toPrimaryKey(accountId),
          gameRoomId: this.mapper.toPrimaryKey(gameRoomId),
        },
      },
    });

    if (raw === null) {
      return;
    }

    return this.mapper.toEntity(raw);
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<GameRoomMemberOrder, GameRoomMemberFilter>,
  ): Promise<ICursorPaginated<GameRoomMember>> {
    throw new Error('Method not implemented.');
  }
}
