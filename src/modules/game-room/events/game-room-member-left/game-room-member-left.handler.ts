import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomMemberLeftSocketEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left-socket.event';
import { GameRoomMemberLeftEvent } from '@module/game-room/events/game-room-member-left/game-room-member-left.event';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

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
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
    @Inject(SOCKET_SESSION_MANAGER)
    private readonly socketSessionManager: ISocketSessionManager,
  ) {}

  @OnEvent(GameRoomMemberLeftEvent.name)
  async handle(event: GameRoomMemberLeftEvent): Promise<void> {
    const currentMembersCount =
      await this.gameRoomRepository.decrementCurrentMembersCount(
        event.eventPayload.gameRoomId,
      );

    await this.socketSessionManager.remoteLeaveByAccount(
      event.eventPayload.accountId,
      gameRoomKeyOf(event.eventPayload.gameRoomId),
    );

    this.publish(event, currentMembersCount);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '유저가 게임방에 퇴장',
    channel: GameRoomMemberLeftSocketEvent.EVENT_NAME,
    message: { payload: GameRoomMemberLeftSocketEvent },
  })
  private publish(
    event: GameRoomMemberLeftEvent,
    currentMembersCount: number,
  ): void {
    const socketEvent = new GameRoomMemberLeftSocketEvent({
      accountId: event.eventPayload.accountId,
      gameRoomId: event.eventPayload.gameRoomId,
      role: event.eventPayload.role,
      currentMembersCount,
      nickname: event.eventPayload.nickname,
    });

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(event.eventPayload.gameRoomId),
      socketEvent,
    );
  }
}
