import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const options: any =
      process.env.NODE_ENV === 'test'
        ? undefined
        : {
            log: [
              {
                emit: 'event',
                level: 'query',
              },
              {
                emit: 'event',
                level: 'error',
              },
              {
                emit: 'stdout',
                level: 'info',
              },
              {
                emit: 'stdout',
                level: 'warn',
              },
            ],
          };

    super(options);

    this.$on('query', (event: any) => {
      this.logger.verbose({
        query: event.query,
        params: event.params,
        duration: event.duration + 'ms',
      });
    });
  }

  async onModuleInit() {
    this.$on('error', (event: any) => {
      this.logger.verbose(event.target);
    });
    await this.$connect();
  }
}
