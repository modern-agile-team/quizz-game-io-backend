import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AccountNotFoundError } from '@module/account/errors/account-not-found.error';
import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoomDto } from '@module/game-room/dto/game-room.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_ACCESS_CONTROL_SERVICE,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';
import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

import { BaseHttpException } from '@common/base/base-http-exception';
import { UnauthorizedError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('game-room')
@ApiBearerAuth()
@Controller()
export class GetGameRoomController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(GAME_ROOM_ACCESS_CONTROL_SERVICE)
    private readonly gameRoomAccessControlService: IGameRoomAccessControlService,
  ) {}

  @ApiOperation({ summary: '게임 방 상세 조회' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: GameRoomDto })
  @ApiErrorResponse({
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [GameRoomAccessDeniedError],
    [HttpStatus.NOT_FOUND]: [GameRoomNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @Get('game-rooms/:gameRoomId')
  async getGameRoom(
    @Param('gameRoomId') gameRoomId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<GameRoomDto> {
    await this.gameRoomAccessControlService.allowMember({
      accountId: currentUser.id,
      gameRoomId,
    });

    const query = new GetGameRoomQuery({
      gameRoomId,
    });

    try {
      const gameRoom = await this.queryBus.execute<GetGameRoomQuery, GameRoom>(
        query,
      );

      return GameRoomDtoAssembler.convertToDto(gameRoom);
    } catch (error) {
      if (error instanceof GameRoomAccessDeniedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      if (error instanceof AccountNotFoundError) {
        throw new BaseHttpException(HttpStatus.INTERNAL_SERVER_ERROR, error);
      }

      throw error;
    }
  }
}
