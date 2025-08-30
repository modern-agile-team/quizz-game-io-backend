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

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { GameRoomMemberCollectionDtoAssembler } from '@module/game-room/assemblers/game-room-member-collection-dto.assembler';
import { GameRoomMemberCollectionDto } from '@module/game-room/dto/game-room-member-collection.dto';
import { GameRoomMember } from '@module/game-room/entities/game-room-member.entity';
import { GameRoomAccessDeniedError } from '@module/game-room/errors/game-room-access-denied.error';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import {
  GAME_ROOM_ACCESS_CONTROL_SERVICE,
  IGameRoomAccessControlService,
} from '@module/game-room/services/game-room-access-control/game-room-access-control.service.interface';
import { ListGameRoomMembersQuery } from '@module/game-room/use-cases/list-game-room-members/list-game-room-members.query';

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
import { ParsePositiveIntStringPipe } from '@common/pipes/positive-int-string.pipe';

@ApiTags('game-room')
@Controller()
export class ListGameRoomMembersController {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(GAME_ROOM_ACCESS_CONTROL_SERVICE)
    private readonly gameRoomAccessControlService: IGameRoomAccessControlService,
  ) {}

  @ApiOperation({ summary: '게임방 유저 목록 조회' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: GameRoomMemberCollectionDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
    [HttpStatus.FORBIDDEN]: [GameRoomAccessDeniedError],
    [HttpStatus.NOT_FOUND]: [GameRoomNotFoundError],
  })
  @UseGuards(JwtAuthGuard)
  @Get('game-rooms/:gameRoomId/members')
  async listGameRoomMembers(
    @CurrentUser() currentUser: ICurrentUser,
    @Param('gameRoomId', ParsePositiveIntStringPipe) gameRoomId: string,
  ): Promise<GameRoomMemberCollectionDto> {
    try {
      await this.gameRoomAccessControlService.allowMember({
        accountId: currentUser.id,
        gameRoomId,
      });

      const query = new ListGameRoomMembersQuery({
        gameRoomId,
      });

      const gameRoomMembers = await this.queryBus.execute<
        ListGameRoomMembersQuery,
        GameRoomMember[]
      >(query);

      return GameRoomMemberCollectionDtoAssembler.convertToDto(gameRoomMembers);
    } catch (error) {
      if (error instanceof GameRoomAccessDeniedError) {
        throw new BaseHttpException(HttpStatus.FORBIDDEN, error);
      }
      if (error instanceof GameRoomNotFoundError) {
        throw new BaseHttpException(HttpStatus.NOT_FOUND, error);
      }

      throw error;
    }
  }
}
