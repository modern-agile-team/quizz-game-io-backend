import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GameRoomCollectionDtoAssembler } from '@module/game-room/assemblers/game-room-collection-dto.assembler';
import { GameRoomCollectionDto } from '@module/game-room/dto/game-room-collection.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { ListGameRoomsDto } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.dto';
import { ListGameRoomsQuery } from '@module/game-room/use-cases/list-game-rooms/list-game-rooms.query';

import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('game-room')
@Controller()
export class ListGameRoomsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiErrorResponse({})
  @ApiOperation({ summary: '게임방 목록 조회' })
  @ApiOkResponse({ type: GameRoomCollectionDto })
  @Get('game-rooms')
  async listGameRooms(
    @Query() dto: ListGameRoomsDto,
  ): Promise<GameRoomCollectionDto> {
    const query = new ListGameRoomsQuery({ sort: dto.sort });

    const gameRooms = await this.queryBus.execute<
      ListGameRoomsQuery,
      GameRoom[]
    >(query);

    return GameRoomCollectionDtoAssembler.convertToDto(gameRooms);
  }
}
