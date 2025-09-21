import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberRoleChangedEvent } from '@module/game-room/events/game-room-member-role-changed/game-room-member-role-changed.event';
import { GameRoomRepository } from '@module/game-room/repositories/game-room/game-room.repository';
import { GAME_ROOM_REPOSITORY } from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  GameRoomChangedSocketEvent,
  GameRoomChangedSocketEventAction,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import {
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

@Injectable()
export class GameRoomMemberRoleChangedHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepository,
    @Inject(GAME_ROOM_SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: IGameRoomSocketEventPublisher,
  ) {}

  @OnEvent(GameRoomMemberRoleChangedEvent.name)
  async handle(event: GameRoomMemberRoleChangedEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    const socketDto = GameRoomDtoAssembler.convertToSocketEventDto(
      gameRoom as GameRoom,
    );

    this.eventPublisher.publishToGameRoom(
      new GameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_role_changed,
        socketDto,
      ),
    );
  }
}
