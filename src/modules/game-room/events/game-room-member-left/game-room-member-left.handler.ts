import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  GameRoomChangedSocketEvent,
  GameRoomChangedSocketEventAction,
  LobbyGameRoomChangedSocketEvent,
} from '@module/game-room/socket-events/game-room-changed.socket-event';

import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

@Injectable()
export class GameRoomMemberLeftHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: ISocketEventPublisher,
  ) {}

  @OnEvent(GameRoomMemberLeftEvent.name)
  async handle(event: GameRoomMemberLeftEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError(
        `GameRoomMemberLeftHandler expected game room, received undefined.`,
      );
    }

    const socketDto = GameRoomDtoAssembler.convertToSocketEventDto(
      gameRoom as GameRoom,
    );

    this.eventPublisher.publishToLobby(
      new LobbyGameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_left,
        socketDto,
      ),
    );

    this.eventPublisher.leaveAndPublishToGameRoom(
      event.eventPayload.accountId,
      gameRoom.id,
      new GameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_left,
        socketDto,
      ),
    );
  }
}
