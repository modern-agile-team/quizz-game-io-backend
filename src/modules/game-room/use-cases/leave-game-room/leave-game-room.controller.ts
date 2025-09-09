import {
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import {
  GAME_ROOM_ACCESS_CONTROL_SERVICE,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';
import { LeaveGameRoomCommand } from '@module/game-room/use-cases/leave-game-room/leave-game-room.command';

import { BaseHttpException } from '@common/base/base-http-exception';
import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('room-member')
@Controller()
export class LeaveGameRoomController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(GAME_ROOM_ACCESS_CONTROL_SERVICE)
    private readonly gameRoomAccessControlService: IGameRoomAccessControlService,
  ) {}

  @ApiOperation({ summary: '게임 방 퇴장' })
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @UseGuards(JwtAuthGuard)
  @Delete('/game-room/:gameRoomId/members/me')
  async leaveGameRoom(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('gameRoomId') gameRoomId: string,
  ): Promise<void> {
    try {
      await this.gameRoomAccessControlService.allowMember({
        accountId: currentUser.id,
        gameRoomId,
      });

      const command = new LeaveGameRoomCommand({
        currentAccountId: currentUser.id,
        gameRoomId,
      });

      await this.commandBus.execute<LeaveGameRoomCommand, void>(command);
    } catch (error) {
      if (error instanceof GameRoomAccessDeniedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }

      throw error;
    }
  }
}
