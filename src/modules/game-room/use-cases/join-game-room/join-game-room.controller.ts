import { Controller, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { RoomMemberDtoAssembler } from '@module/game-room/assemblers/room-member-dto.assembler';
import { RoomMemberDto } from '@module/game-room/dto/room-member.dto';
import { RoomMember } from '@module/game-room/entities/room-member.entity';
import { GameRoomMemberCapacityExceededError } from '@module/game-room/errors/game-room-member-capacity-exceeded.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { RoomMemberAlreadyExistsError } from '@module/game-room/errors/room-member-already-exists.error';
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
  @ApiCreatedResponse({ type: RoomMemberDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.NOT_FOUND]: [GameRoomNotFoundError],
    [HttpStatus.CONFLICT]: [
      RoomMemberAlreadyExistsError,
      GameRoomMemberCapacityExceededError,
    ],
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/game-room/:gameRoomId/members')
  async joinGameRoom(
    @Param('gameRoomId') gameRoomId: string,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<RoomMemberDto> {
    try {
      const command = new JoinGameRoomCommand({
        currentAccountId: currentUser.id,
        gameRoomId,
      });

      const roomMember = await this.commandBus.execute<
        JoinGameRoomCommand,
        RoomMember
      >(command);

      return RoomMemberDtoAssembler.convertToDto(roomMember);
    } catch (error) {
      if (error instanceof GameRoomNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      if (error instanceof RoomMemberAlreadyExistsError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      if (error instanceof GameRoomMemberCapacityExceededError) {
        throw new BaseHttpException(HttpStatus.CONFLICT, error);
      }

      throw error;
    }
  }
}
