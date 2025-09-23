/*
  Warnings:

  - Added the required column `quizzesCount` to the `game_room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. 새 컬럼 추가 (nullable + 임시 default 10)
ALTER TABLE "game_room" ADD COLUMN "quizzesCount" INTEGER DEFAULT 10;

-- 2. 기존 레코드 null 값 채우기
UPDATE "game_room" SET "quizzesCount" = 10 WHERE "quizzesCount" IS NULL;

-- 3. NOT NULL 제약 추가
ALTER TABLE "game_room" ALTER COLUMN "quizzesCount" SET NOT NULL;

-- 4. default 제거 (INSERT 시 반드시 값 명시 필요)
ALTER TABLE "game_room" ALTER COLUMN "quizzesCount" DROP DEFAULT;