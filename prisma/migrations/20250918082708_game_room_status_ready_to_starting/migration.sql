/*
  Warnings:

  - The values [ready] on the enum `GameRoomStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameRoomStatus_new" AS ENUM ('waiting', 'starting', 'inProgress', 'finished', 'paused');
ALTER TABLE "game_room" ALTER COLUMN "status" TYPE "GameRoomStatus_new" USING ("status"::text::"GameRoomStatus_new");
ALTER TYPE "GameRoomStatus" RENAME TO "GameRoomStatus_old";
ALTER TYPE "GameRoomStatus_new" RENAME TO "GameRoomStatus";
DROP TYPE "GameRoomStatus_old";
COMMIT;
