export abstract class BaseSocketEvent<Payload = Record<string, unknown>> {
  abstract readonly eventName: string;
  timestamp: Date;
  payload: Payload;
  meta?: Record<string, unknown>;

  constructor(eventPayload: Payload, meta?: unknown) {
    this.timestamp = new Date();
    this.payload = eventPayload;
    this.meta = meta ? (meta as Record<string, unknown>) : {};
  }
}
