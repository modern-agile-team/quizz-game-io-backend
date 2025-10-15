-- CreateEnum
CREATE TYPE "SocialProvider" AS ENUM ('google');

-- AlterEnum
ALTER TYPE "SignInType" ADD VALUE 'google';

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "socialProvider" "SocialProvider",
ADD COLUMN     "socialProviderUid" TEXT;

-- CreateIndex
CREATE INDEX "account_socialProvider_socialProviderUid_idx" ON "account"("socialProvider", "socialProviderUid");
