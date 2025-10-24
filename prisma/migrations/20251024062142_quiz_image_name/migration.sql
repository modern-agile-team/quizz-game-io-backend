-- 1️⃣ name 컬럼을 NULL 허용 상태로 추가
ALTER TABLE "quiz_image" ADD COLUMN "name" TEXT;

-- 2️⃣ originalFileName에서 확장자를 제거하고 name에 채움
UPDATE "quiz_image"
SET "name" = regexp_replace("originalFileName", '\.[^.]+$', '', 'g')
WHERE "name" IS NULL;

-- 3️⃣ name 컬럼을 NOT NULL로 변경
ALTER TABLE "quiz_image" ALTER COLUMN "name" SET NOT NULL;