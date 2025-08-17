import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@module/auth/jwt/jwt-auth.guard';
import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoomDto } from '@module/game-room/dto/game-room.dto';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { CreateGameRoomCommand } from '@module/game-room/use-cases/create-game-room/create-game-room.command';
import { CreateGameRoomDto } from '@module/game-room/use-cases/create-game-room/create-game-room.dto';

import {
  RequestValidationError,
  UnauthorizedError,
} from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';
import {
  CurrentUser,
  ICurrentUser,
} from '@common/decorator/current-user.decorator';

@ApiTags('game-room')
@ApiBearerAuth()
@Controller('game-rooms')
export class CreateGameRoomController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: '게임 방 생성' })
  @ApiCreatedResponse({ type: GameRoomDto })
  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
    [HttpStatus.UNAUTHORIZED]: [UnauthorizedError],
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createGameRoom(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() body: CreateGameRoomDto,
  ): Promise<GameRoomDto> {
    const command = new CreateGameRoomCommand({
      currentAccountId: currentUser.id,
      title: body.title,
    });

    const gameRoom = await this.commandBus.execute<
      CreateGameRoomCommand,
      GameRoom
    >(command);

    return GameRoomDtoAssembler.convertToDto(gameRoom);
  }
}
