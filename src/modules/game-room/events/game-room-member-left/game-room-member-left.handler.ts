import { Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomDtoAssembler } from '@module/game-room/assemblers/game-room-dto.assembler';
import { GameRoom } from '@module/game-room/entities/game-room.entity';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';
import {
  GameRoomChangedSocketEvent,
  GameRoomChangedSocketEventAction,
} from '@module/game-room/socket-events/game-room-changed.socket-event';
import { GetGameRoomQuery } from '@module/game-room/use-cases/get-game-room/get-game-room.query';

import {
  ISocketSessionManager,
  SOCKET_SESSION_MANAGER,
} from '@core/socket/session-manager/socket-session.manager.interface';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

@AsyncApi()
export class GameRoomMemberLeftHandler {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
    @Inject(SOCKET_SESSION_MANAGER)
    private readonly socketSessionManager: ISocketSessionManager,
  ) {}

  @OnEvent(GameRoomMemberLeftEvent.name)
  async handle(event: GameRoomMemberLeftEvent): Promise<void> {
    await this.socketSessionManager.remoteLeaveByAccount(
      event.eventPayload.accountId,
      gameRoomKeyOf(event.eventPayload.gameRoomId),
    );

    await this.gameRoomRepository.decrementCurrentMembersCount(
      event.eventPayload.gameRoomId,
    );
    const gameRoom = await this.queryBus.execute<GetGameRoomQuery, GameRoom>(
      new GetGameRoomQuery({ gameRoomId: event.eventPayload.gameRoomId }),
    );

    this.publish(gameRoom);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '유저가 게임방에 퇴장',
    channel: GameRoomChangedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomChangedSocketEvent },
  })
  private publish(gameRoom: GameRoom): void {
    const socketEvent = new GameRoomChangedSocketEvent(
      GameRoomChangedSocketEventAction.member_left,
      GameRoomDtoAssembler.convertToSocketEventDto(gameRoom),
    );

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(gameRoom.id),
      socketEvent,
    );
  }
}
