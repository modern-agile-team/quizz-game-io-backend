import { Server } from 'socket.io';

export const SOCKET_SESSION_MANAGER = 'SOCKET_SESSION_MANAGER';

export interface ISocketSessionManager {
  setServer(server: Server): void;

  remoteJoinByAccount(accountId: string, roomKey: string): Promise<void>;

  remoteLeaveByAccount(accountId: string, roomKey: string): Promise<void>;
}
