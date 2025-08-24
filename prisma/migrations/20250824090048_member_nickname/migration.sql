/*
  Warnings:

  - A unique constraint covering the columns `[gameRoomId,nickname]` on the table `game_room_member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `game_room_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable

ALTER TABLE "game_room_member" ADD COLUMN "nickname" VARCHAR(20);

-- 백필 (id → nickname)
UPDATE "game_room_member"
SET "nickname" = "id"::text
WHERE "nickname" IS NULL;


-- NOT NULL 강제
ALTER TABLE "game_room_member" ALTER COLUMN "nickname" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "game_room_member_gameRoomId_nickname_key" ON "game_room_member"("gameRoomId", "nickname");
