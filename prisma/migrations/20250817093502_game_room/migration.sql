-- CreateEnum
CREATE TYPE "GameRoomStatus" AS ENUM ('waiting', 'ready', 'inProgress', 'finished', 'paused');

-- CreateEnum
CREATE TYPE "GameRoomVisibility" AS ENUM ('public', 'private', 'hidden');

-- CreateTable
CREATE TABLE "game_room" (
    "id" BIGINT NOT NULL,
    "accountId" BIGINT NOT NULL,
    "status" "GameRoomStatus" NOT NULL,
    "visibility" "GameRoomVisibility" NOT NULL,
    "title" TEXT NOT NULL,
    "maxPlayersCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_room_event_store" (
    "id" BIGINT NOT NULL,
    "actorId" BIGINT,
    "aggregateId" BIGINT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventPayload" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_room_event_store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_room_event_store_aggregateId_version_key" ON "game_room_event_store"("aggregateId", "version");

-- AddForeignKey
ALTER TABLE "game_room" ADD CONSTRAINT "game_room_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
