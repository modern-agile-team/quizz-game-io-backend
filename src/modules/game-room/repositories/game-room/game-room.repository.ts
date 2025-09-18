import { Inject, Injectable } from '@nestjs/common';

import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMapper } from '@module/game-room/mappers/game-room.mapper';
import {
  GameRoomFilter,
  GameRoomOrder,
  GameRoomRaw,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
  ISort,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class GameRoomRepository
  extends BaseRepository<GameRoom, GameRoomRaw>
  implements GameRoomRepositoryPort
{
  protected TABLE_NAME = 'gameRoom';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, GameRoomMapper);
  }

  async findAll(options: { sort?: ISort[] }): Promise<GameRoom[]> {
    const rows = await this.prismaService.gameRoom.findMany({
      orderBy: this.toOrderBy(options.sort),
    });

    return rows.map((row) => this.mapper.toEntity(row));
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<GameRoomOrder, GameRoomFilter>,
  ): Promise<ICursorPaginated<GameRoom>> {
    throw new Error('Method not implemented.');
  }
}
