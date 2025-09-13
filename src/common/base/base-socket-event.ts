import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseSocketEvent<Body = Record<any, any>> {
  @ApiProperty()
  action: string;

  @ApiProperty()
  abstract readonly eventName: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  body: Body;

  @ApiProperty()
  meta?: Record<string, unknown>;

  constructor(action: string, eventBody: Body, meta?: unknown) {
    this.timestamp = new Date();
    this.action = action;
    this.body = eventBody;
    this.meta = meta ? (meta as Record<string, unknown>) : {};
  }
}
