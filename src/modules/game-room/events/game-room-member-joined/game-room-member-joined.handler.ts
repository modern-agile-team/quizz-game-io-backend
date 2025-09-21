import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
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
  GAME_ROOM_SOCKET_EVENT_PUBLISHER,
  IGameRoomSocketEventPublisher,
} from '@module/game-room/socket-events/publisher/game-room-socket-event.publisher.interface';

@Injectable()
export class GameRoomMemberJoinedHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(GAME_ROOM_SOCKET_EVENT_PUBLISHER)
    private readonly eventPublisher: IGameRoomSocketEventPublisher,
  ) {}

  @OnEvent(GameRoomMemberJoinedEvent.name)
  async handle(event: GameRoomMemberJoinedEvent): Promise<void> {
    const gameRoom = await this.gameRoomRepository.findOneById(
      event.aggregateId,
    );

    const socketDto = GameRoomDtoAssembler.convertToSocketEventDto(
      gameRoom as GameRoom,
    );

    this.eventPublisher.publishToLobby(
      new LobbyGameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_joined,
        socketDto,
      ),
    );
    await this.eventPublisher.joinAndPublishToGameRoom(
      event.eventPayload.accountId,
      new GameRoomChangedSocketEvent(
        GameRoomChangedSocketEventAction.member_joined,
        socketDto,
      ),
    );
  }
}
