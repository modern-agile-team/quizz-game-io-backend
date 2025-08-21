import { Controller, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { GameRoomMemberDtoAssembler } from '@module/game-room/assemblers/game-room-member-dto.assembler';
import { GameRoomMemberDto } from '@module/game-room/dto/game-room-member.dto';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomMemberAlreadyExistsError } from '@module/game-room/errors/game-room-member-already-exists.error';
import { GameRoomMemberCapacityExceededError } from '@module/game-room/errors/game-room-member-capacity-exceeded.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { JoinGameRoomCommand } from '@module/game-room/use-cases/join-game-room/join-game-room.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import {
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

/**
 * @todo #32 SBAC 적용
 */
@ApiTags('room-member')
@Controller()
export class JoinGameRoomController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '게임 방 입장' })
  @ApiCreatedResponse({ type: GameRoomMemberDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.NOT_FOUND]: [GameRoomNotFoundError],
    [HttpStatus.CONFLICT]: [
      GameRoomMemberAlreadyExistsError,
      GameRoomMemberCapacityExceededError,
    ],
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/game-room/:gameRoomId/members')
  async joinGameRoom(
    @Param('gameRoomId') gameRoomId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<GameRoomMemberDto> {
    try {
      const command = new JoinGameRoomCommand({
        currentAccountId: currentUser.id,
        gameRoomId,
      });

      const gameRoomMember = await this.commandBus.execute<
        JoinGameRoomCommand,
        GameRoomMember
      >(command);

      return GameRoomMemberDtoAssembler.convertToDto(gameRoomMember);
    } catch (error) {
      if (error instanceof GameRoomNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof GameRoomMemberAlreadyExistsError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      if (error instanceof GameRoomMemberCapacityExceededError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
