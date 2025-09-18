/*
  Warnings:

  - You are about to drop the `game_room_member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "game_room_member" DROP CONSTRAINT "game_room_member_accountId_fkey";

-- DropForeignKey
ALTER TABLE "game_room_member" DROP CONSTRAINT "game_room_member_gameRoomId_fkey";

-- AlterTable
ALTER TABLE "game_room" ADD COLUMN     "members" JSONB[] DEFAULT ARRAY[]::JSONB[];

-- DropTable
DROP TABLE "game_room_member";

-- DropEnum
DROP TYPE "GameRoomMemberRole";
