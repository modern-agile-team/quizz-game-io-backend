import { Injectable } from '@nestjs/common';

import { Server } from 'socket.io';

import { BaseSocketEvent } from '@common/base/base-socket-event';

import { ISocketEventEmitter } from '@core/socket/socket-event.emitter.interface';

@Injectable()
export class SocketEventEmitter implements ISocketEventEmitter {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emit(event: BaseSocketEvent): void {
    this.server.emit(event.eventName, event);
  }

  emitToNamespace(namespace: string, event: BaseSocketEvent): void {
    this.server.of(namespace).emit(event.eventName, event);
  }

  emitToRoom(namespace: string, room: string, event: BaseSocketEvent): void {
    this.server.of(namespace).to(room).emit(event.eventName, event);
  }

  emitToClient(socketId: string, event: BaseSocketEvent): void {
    this.server.to(socketId).emit(event.eventName, event);
  }
}
