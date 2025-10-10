import { Injectable } from '@nestjs/common';

import {
  InjectTransactionHost,
  TransactionHost,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

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

@Injectable()
export class GameRoomRepository
  extends BaseRepository<GameRoom, GameRoomRaw>
  implements GameRoomRepositoryPort
{
  protected TABLE_NAME = 'gameRoom';

  constructor(
    @InjectTransactionHost()
    protected readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(txHost, GameRoomMapper);
  }

  async findAll(options: { sort?: ISort[] }): Promise<GameRoom[]> {
    const rows = await this.txHost.tx.gameRoom.findMany({
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
