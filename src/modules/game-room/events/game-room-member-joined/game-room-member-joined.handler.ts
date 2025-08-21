import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AsyncApi, AsyncApiPub } from 'nestjs-asyncapi';

import { GameRoomMemberJoinedSocketEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined-socket.event';
import { GameRoomMemberJoinedEvent } from '@module/game-room/events/game-room-member-joined/game-room-member-joined.event';
import {
  GAME_ROOM_REPOSITORY,
  GameRoomRepositoryPort,
} from '@module/game-room/repositories/game-room/game-room.repository.port';

import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
  WS_NAMESPACE,
} from '@core/socket/socket-event.emitter.interface';
import { gameRoomKeyOf } from '@core/socket/socket-room.util';

@AsyncApi()
export class GameRoomMemberJoinedHandler {
  constructor(
    @Inject(GAME_ROOM_REPOSITORY)
    private readonly gameRoomRepository: GameRoomRepositoryPort,
    @Inject(SOCKET_EVENT_EMITTER)
    private readonly socketEmitter: ISocketEventEmitter,
  ) {}

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '유저가 게임방에 접속',
    channel: GameRoomMemberJoinedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomMemberJoinedSocketEvent },
  })
  @OnEvent(GameRoomMemberJoinedEvent.name)
  async handle(event: GameRoomMemberJoinedEvent): Promise<void> {
    const currentMembersCount =
      await this.gameRoomRepository.incrementCurrentMembersCount(
        event.eventPayload.gameRoomId,
      );

    this.publish(event, currentMembersCount);
  }

  @AsyncApiPub({
    tags: [{ name: 'game_room' }],
    description: '유저가 게임방에 접속',
    channel: GameRoomMemberJoinedSocketEvent.EVENT_NAME,
    message: { payload: GameRoomMemberJoinedSocketEvent },
  })
  private publish(
    event: GameRoomMemberJoinedEvent,
    currentMembersCount: number,
  ): void {
    const socketEvent = new GameRoomMemberJoinedSocketEvent({
      accountId: event.eventPayload.accountId,
      gameRoomId: event.eventPayload.gameRoomId,
      role: event.eventPayload.role,
      currentMembersCount,
    });

    this.socketEmitter.emitToRoom(
      WS_NAMESPACE.ROOT,
      gameRoomKeyOf(event.eventPayload.gameRoomId),
      socketEvent,
    );
  }
}
