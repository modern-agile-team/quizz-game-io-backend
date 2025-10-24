# Zoop

Real-time backend for the Quizz Game IO platform. The service is built with NestJS 11, Prisma, and Socket.IO to deliver multiplayer quiz gameplay, OAuth-based authentication, and media management via Amazon S3.

## Features

- WebSocket gateway with Redis adapter for scalable real-time gameplay.
- CQRS-based modular architecture with event sourcing stores per aggregate.
- Prisma/PostgreSQL persistence with seed scripts for quizzes and nickname sources.
- JWT authentication with optional Google OAuth 2.0 sign-in.
- Image upload and metadata management backed by Amazon S3.
- Structured logging via `nestjs-pino` with environment-aware formatting.
- Auto-generated API documentation (Swagger + AsyncAPI) segmented for admin and user flows.

## Tech Stack

- Node.js (NestJS 11, Socket.IO, CQRS, Class Validator/Transformer)
- Prisma ORM (PostgreSQL)
- Redis (Socket session index + Pub/Sub for WebSockets)
- Amazon S3 (quiz images)
- Jest, Testcontainers (unit/e2e testing)

## Prerequisites

- Node.js ≥ 20.x and npm ≥ 10.x
- Docker & Docker Compose (for local PostgreSQL/Redis or Testcontainers)
- Access credentials for PostgreSQL, Redis, JWT signing secret, and optional AWS/Google integrations

## Getting Started

```bash
npm install
```

Create your environment file (never commit secrets):

```bash
cp .env .env.local
```

Update `.env.local` (or `.env`) with your values. Key variables are grouped below:

| Group                   | Keys                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| App                     | `PORT`, `NODE_ENV`, `APP_STAGE`                                                                                              |
| Database                | `DATABASE_URL`                                                                                                               |
| Redis                   | `REDIS_URL`                                                                                                                  |
| JWT                     | `JWT_SECRET_KEY`, `JWT_ISSUER`, `JWT_ACCESS_TOKEN_EXPIRES_IN`                                                                |
| Logging                 | `LOGGER_LEVEL`                                                                                                               |
| AWS S3 (optional)       | `AWS_S3_REGION`, `AWS_S3_BUCKET_NAME`, `AWS_S3_URL`, `AWS_S3_ACCESS_KEY`, `AWS_S3_SECRET_KEY`, `AWS_S3_QUIZ_IMAGE_FILE_PATH` |
| OAuth redirect          | `OAUTH_ALLOW_REDIRECT_URLS`, `OAUTH_DEFAULT_REDIRECT_URL`                                                                    |
| Google OAuth (optional) | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_CALLBACK_URL`, `GOOGLE_OAUTH_SCOPE`                    |

### Local Infrastructure

Bring up PostgreSQL and Redis with Docker:

```bash
docker compose up -d
```

Apply existing Prisma migrations:

```bash
npx prisma migrate deploy
```

Seed local quiz and nickname data (optional):

```bash
npm run db:seed:mock
```

### Run the Application

```bash
# Development with hot reload
npm run start:dev

# Production build and start
npm run build
npm run start:prod
```

The HTTP server listens on `PORT` (default `3000`).

### WebSocket Access

- Namespace: `/`
- Clients supply JWT via Socket.IO handshake auth: `io('/', { auth: { token: 'Bearer <jwt>' } })`.
- On connection the gateway validates the token, loads account context, and registers socket IDs in Redis.

### API Documentation

- Swagger (full): `http://localhost:3000/swagger`
- Swagger (admin-only routes): `http://localhost:3000/swagger/admin`
- Swagger (user-facing routes): `http://localhost:3000/swagger/user`
- AsyncAPI (WebSocket events): `http://localhost:3000/async-doc`

### Testing

```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end (requires Docker for Testcontainers)
npm run test:cov      # coverage report
```

### Code Generation Scripts

- `npm run gen:usecase` – scaffolds a CQRS use case preset.
- `npm run gen:domain` – scaffolds domain-layer boilerplate.

### Project Structure (excerpt)

```
src/
  app.module.ts
  bootstrap.ts
  common/          # configuration, guards, pipes, base classes
  core/            # socket adapters, event-sourcing utilities
  modules/
    account/       # account aggregates, commands, queries
    auth/          # JWT + OAuth flows
    game-room/     # room lifecycle and member management
    nickname-source/
    quiz/
    quiz-image/
  shared/          # Prisma, logging, other cross-cutting concerns
prisma/
  schema.prisma
  migrations/
  seed/
```

## Deployment Notes

- Build with `npm run build`; run `node dist/main.js` or `npm run start:prod`.
- Ensure `DATABASE_URL`, `REDIS_URL`, and credential secrets are injected via environment variables in your runtime.
- For horizontal scaling, provide a shared Redis instance so the Socket.IO adapter can distribute events.

## License

This repository is currently distributed under the `UNLICENSED` license. Refer to `package.json` for details.
