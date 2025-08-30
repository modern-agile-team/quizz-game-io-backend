import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { ServerOptions } from 'socket.io';

import {
  ISocketSessionManager,
  SOCKET_SESSION_MANAGER,
} from '@core/socket/session-manager/socket-session.manager.interface';
import {
  ISocketEventEmitter,
  SOCKET_EVENT_EMITTER,
} from '@core/socket/socket-event.emitter.interface';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(private app: INestApplication) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = new Redis(`${process.env.REDIS_URL}/0`);
    const subClient = pubClient.duplicate();

    await Promise.all([
      new Promise<void>((resolve) => pubClient.once('ready', resolve)),
      new Promise<void>((resolve) => subClient.once('ready', resolve)),
    ]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);

    server.adapter(this.adapterConstructor);

    const socketEventEmitter =
      this.app.get<ISocketEventEmitter>(SOCKET_EVENT_EMITTER);
    socketEventEmitter.setServer(server);

    const socketSessionManager = this.app.get<ISocketSessionManager>(
      SOCKET_SESSION_MANAGER,
    );
    socketSessionManager.setServer(server);

    return server;
  }
}
