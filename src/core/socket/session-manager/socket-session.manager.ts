import { Inject, Injectable } from '@nestjs/common';

import { Server } from 'socket.io';

import {
  ACCOUNT_SOCKET_INDEX_STORE,
  IAccountSocketIndexStore,
} from '@core/socket/index-store/account-socket-index.store.interface';
import { ISocketSessionManager } from '@core/socket/session-manager/socket-session.manager.interface';

@Injectable()
export class SocketSessionManager implements ISocketSessionManager {
  private server: Server;

  constructor(
    @Inject(ACCOUNT_SOCKET_INDEX_STORE)
    private readonly accountSocketIndexStore: IAccountSocketIndexStore,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async remoteJoinByAccount(accountId: string, roomKey: string) {
    const sid = await this.accountSocketIndexStore.get(accountId);

    if (sid === undefined) {
      return;
    }

    const sockets = await this.server.in(sid).fetchSockets();
    await Promise.all(sockets.map((socket) => socket.join(roomKey)));
  }
  async remoteLeaveByAccount(accountId: string, roomKey: string) {
    const sid = await this.accountSocketIndexStore.get(accountId);

    if (sid === undefined) {
      return;
    }

    const sockets = await this.server.in(sid).fetchSockets();
    await Promise.all(sockets.map((socket) => socket.leave(roomKey)));
  }
}
