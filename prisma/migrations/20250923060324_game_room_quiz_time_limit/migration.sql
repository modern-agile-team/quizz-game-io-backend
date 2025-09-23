/*
  Warnings:

  - Added the required column `quizTimeLimitInSec` to the `game_room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. 새 컬럼 추가 (nullable + 임시 default 30)
ALTER TABLE "game_room" ADD COLUMN "quizTimeLimitInSec" INTEGER DEFAULT 30;

-- 2. 기존 레코드 null 값 채우기
UPDATE "game_room" SET "quizTimeLimitInSec" = 30 WHERE "quizTimeLimitInSec" IS NULL;

-- 3. NOT NULL 제약 추가
ALTER TABLE "game_room" ALTER COLUMN "quizTimeLimitInSec" SET NOT NULL;

-- 4. default 제거 (INSERT 시 반드시 명시해야 함)
ALTER TABLE "game_room" ALTER COLUMN "quizTimeLimitInSec" DROP DEFAULT;
