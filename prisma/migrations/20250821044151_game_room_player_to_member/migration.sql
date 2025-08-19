/*
  Warnings:

  - You are about to drop the column `currentPlayersCount` on the `game_room` table. All the data in the column will be lost.
  - You are about to drop the column `maxPlayersCount` on the `game_room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "game_room" DROP COLUMN "currentPlayersCount",
DROP COLUMN "maxPlayersCount",
ADD COLUMN     "currentMembersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxMembersCount" INTEGER NOT NULL DEFAULT 0;
