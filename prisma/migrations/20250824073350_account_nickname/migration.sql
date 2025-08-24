/*
  마이그레이션 절차:
  1) 닉네임 컬럼 추가 (nullable)
  2) 기존 row의 nickname = id::text 로 백필
  3) NOT NULL + UNIQUE 제약 추가
*/

-- Step 1
ALTER TABLE "account" ADD COLUMN "nickname" VARCHAR(20);

-- Step 2
UPDATE "account"
SET "nickname" = "id"::text
WHERE "nickname" IS NULL;

-- Step 3
ALTER TABLE "account" ALTER COLUMN "nickname" SET NOT NULL;

CREATE UNIQUE INDEX "account_nickname_key" ON "account"("nickname");