import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomStartingEvent } from '@module/game-room/events/game-room-starting/game-room-starting.event';
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
export class GameRoomStartingHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: ISocketEventPublisher,
  ) {}

  @OnEvent(GameRoomStartingEvent.name)
  async handle(event: GameRoomStartingEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError(
        `GameRoomStartingHandler expected game room, received undefined.`,
      );
    }

    const eventDto = GameRoomDtoAssembler.convertToSocketEventDto(
      gameRoom as GameRoom,
    );

    this.eventPublisher.publishToGameRoom(
      gameRoom.id,
      new GameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.game_starting,
        eventDto,
      ),
    );
    this.eventPublisher.publishToLobby(
      new LobbyGameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.game_starting,
        eventDto,
      ),
    );
  }
}
