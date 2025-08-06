import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseSocketEvent<Body = Record<any, any>> {
  @ApiProperty()
  abstract readonly eventName: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  body: Body;

  @ApiProperty()
  meta?: Record<string, unknown>;

  constructor(eventBody: Body, meta?: unknown) {
    this.timestamp = new Date();
    this.body = eventBody;
    this.meta = meta ? (meta as Record<string, unknown>) : {};
  }
}
