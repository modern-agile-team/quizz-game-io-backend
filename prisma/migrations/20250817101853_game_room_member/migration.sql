-- CreateEnum
CREATE TYPE "GameRoomMemberRole" AS ENUM ('host', 'player');

-- CreateTable
CREATE TABLE "game_room_member" (
    "id" BIGINT NOT NULL,
    "accountId" BIGINT NOT NULL,
    "gameRoomId" BIGINT NOT NULL,
    "role" "GameRoomMemberRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_room_member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_room_member_accountId_gameRoomId_key" ON "game_room_member"("accountId", "gameRoomId");

-- AddForeignKey
ALTER TABLE "game_room_member" ADD CONSTRAINT "game_room_member_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_room_member" ADD CONSTRAINT "game_room_member_gameRoomId_fkey" FOREIGN KEY ("gameRoomId") REFERENCES "game_room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
