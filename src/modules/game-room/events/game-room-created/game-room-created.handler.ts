import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomCreatedEvent } from '@module/game-room/events/game-room-created/game-room-created.event';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  GameRoomCreatedSocketEventAction,
  LobbyGameRoomCreatedSocketEvent,
} from '@module/game-room/socket-events/game-room-created.socket-event';

import {
  ISocketEventPublisher,
  SOCKET_EVENT_PUBLISHER,
} from '@core/socket/event-publisher/socket-event.publisher.interface';

@Injectable()
export class GameRoomCreatedHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: ISocketEventPublisher,
  ) {}

  @OnEvent(GameRoomCreatedEvent.name)
  async handle(event: GameRoomCreatedEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError(
        `GameRoomCreatedHandler expected game room, received undefined.`,
      );
    }

    const socketEvent = new LobbyGameRoomCreatedSocketEvent(
      GameRoomCreatedSocketEventAction.created,
      GameRoomDtoAssembler.convertToSocketEventDto(gameRoom as GameRoom),
    );

    this.eventPublisher.publishToLobby(socketEvent);
  }
}
