import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoomNotFoundError } from '@module/game-room/errors/game-room-not-found.error';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';
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
export class GameRoomMemberJoinedHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: ISocketEventPublisher,
  ) {}

  @OnEvent(GameRoomMemberJoinedEvent.name)
  async handle(event: GameRoomMemberJoinedEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    if (gameRoom === undefined) {
      throw new GameRoomNotFoundError(
        `GameRoomMemberJoinedHandler expected game room, received undefined.`,
      );
    }

    const socketDto = GameRoomDtoAssembler.convertToSocketEventDto(gameRoom);

    this.eventPublisher.publishToLobby(
      new LobbyGameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_joined,
        socketDto,
      ),
    );
    await this.eventPublisher.joinAndPublishToGameRoom(
      event.eventPayload.accountId,
      gameRoom.id,
      new GameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_joined,
        socketDto,
      ),
    );
  }
}
