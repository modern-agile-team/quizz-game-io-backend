/*
  Warnings:

  - Added the required column `isActive` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add `isActive` column as nullable with default true
ALTER TABLE "account" ADD COLUMN "isActive" BOOLEAN DEFAULT true;

-- Step 2: Update existing rows where `isActive` is null to true
UPDATE "account" SET "isActive" = true WHERE "isActive" IS NULL;

-- Step 3: Alter the column to set NOT NULL
ALTER TABLE "account" ALTER COLUMN "isActive" SET NOT NULL;

-- Step 4: Drop the default
ALTER TABLE "account" ALTER COLUMN "isActive" DROP DEFAULT;

-- Step 5: Add `lastLeftAt` column
ALTER TABLE "account" ADD COLUMN "lastLeftAt" TIMESTAMP(3);
