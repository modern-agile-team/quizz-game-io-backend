import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMapper } from '@module/game-room/mappers/game-room.mapper';
import {
  GameRoomFilter,
  GameRoomOrder,
  GameRoomRaw,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import { EntityId } from '@common/base/base.entity';
import { RecordNotFoundError } from '@common/base/base.error';
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

  async incrementCurrentMembersCount(gameRoomId: EntityId): Promise<number> {
    try {
      const updatedProject = await this.prismaService.gameRoom.update({
        where: {
          id: this.mapper.toPrimaryKey(gameRoomId),
        },
        data: {
          currentMembersCount: {
            increment: 1,
          },
        },
      });

      return updatedProject.currentMembersCount;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RecordNotFoundError();
        }
      }

      throw error;
    }
  }

  async decrementCurrentMembersCount(gameRoomId: EntityId): Promise<number> {
    try {
      const updatedProject = await this.prismaService.gameRoom.update({
        where: {
          id: this.mapper.toPrimaryKey(gameRoomId),
        },
        data: {
          currentMembersCount: {
            decrement: 1,
          },
        },
      });

      return updatedProject.currentMembersCount;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RecordNotFoundError();
        }
      }

      throw error;
    }
  }

  findAllCursorPaginated(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ICursorPaginatedParams<GameRoomOrder, GameRoomFilter>,
  ): Promise<ICursorPaginated<GameRoom>> {
    throw new Error('Method not implemented.');
  }
}
