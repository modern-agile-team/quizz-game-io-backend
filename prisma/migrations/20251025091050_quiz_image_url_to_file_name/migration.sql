-- 1️⃣ 컬럼 이름 변경
ALTER TABLE "quiz" RENAME COLUMN "imageUrl" TO "imageFileName";

-- 2️⃣ 기존 데이터에서 filename만 남기도록 업데이트
UPDATE "quiz"
SET "imageFileName" = regexp_replace("imageFileName", '.*/', '')
WHERE "imageFileName" IS NOT NULL;