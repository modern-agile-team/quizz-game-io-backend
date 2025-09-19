import {
  Controller,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoomDto } from '@module/game-room/dto/game-room.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomValidationError } from '@module/game-room/errors/game-room-validation.error';
import {
  GAME_ROOM_ACCESS_CONTROL_SERVICE,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';
import { StartGameCommand } from '@module/game-room/use-cases/start-game/start-game.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('game-room')
@Controller()
export class StartGameController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GAME_ROOM_ACCESS_CONTROL_SERVICE)
    private readonly gameRoomAccessControlService: IGameRoomAccessControlService,
  ) {}

  @ApiOperation({ summary: '게임 시작 요청' })
  @ApiOkResponse({ type: GameRoomDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError, GameRoomValidationError],
    [HttpStatus.FORBIDDEN]: [GameRoomAccessDeniedError],
    [HttpStatus.NOT_FOUND]: [GameRoomNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/game-room/:gameRoomId/start')
  async startGame(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('gameRoomId') gameRoomId: string,
  ): Promise<GameRoomDto> {
    try {
      await this.gameRoomAccessControlService.allowHost({
        accountId: currentUser.id,
        gameRoomId,
      });

      const command = new StartGameCommand({ gameRoomId });

      const gameRoom = await this.commandBus.execute<
        StartGameCommand,
        GameRoom
      >(command);

      return GameRoomDtoAssembler.convertToDto(gameRoom);
    } catch (error) {
      if (error instanceof GameRoomAccessDeniedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }
      if (error instanceof GameRoomNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }
      if (error instanceof GameRoomValidationError) {
        throw new BaseHttpException(HttpStatus.BAD_REQUEST, error);
      }

      throw error;
    }
  }
}
