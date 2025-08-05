import { Server } from 'socket.io';

import { BaseSocketEvent } from '@common/base/base-socket-event';

export const SOCKET_EVENT_EMITTER = 'SOCKET_EVENT_EMITTER';

export const WS_NAMESPACE = {
  ROOT: '/',
} as const;

export type WsNamespace = (typeof WS_NAMESPACE)[keyof typeof WS_NAMESPACE];

export interface ISocketEventEmitter {
  setServer(server: Server): void;

  emit(event: BaseSocketEvent): void;

  emitToNamespace(namespace: WsNamespace, event: BaseSocketEvent): void;

  emitToRoom(
    namespace: WsNamespace,
    room: string,
    event: BaseSocketEvent,
  ): void;

  emitToClient(socketId: string, event: BaseSocketEvent): void;
}
