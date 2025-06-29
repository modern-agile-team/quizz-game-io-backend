-- CreateEnum
CREATE TYPE "SignInType" AS ENUM ('username');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "account" (
    "id" BIGINT NOT NULL,
    "role" "AccountRole" NOT NULL,
    "signInType" "SignInType" NOT NULL,
    "username" VARCHAR(20),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_username_key" ON "account"("username");
