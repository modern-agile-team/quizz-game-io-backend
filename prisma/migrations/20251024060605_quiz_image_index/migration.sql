-- AlterTable
ALTER TABLE "quiz_image" RENAME CONSTRAINT "image_pkey" TO "quiz_image_pkey";

-- AlterTable
ALTER TABLE "quiz_image_event_store" RENAME CONSTRAINT "image_event_store_pkey" TO "quiz_image_event_store_pkey";

-- RenameIndex
ALTER INDEX "image_fileName_idx" RENAME TO "quiz_image_fileName_idx";

-- RenameIndex
ALTER INDEX "image_event_store_aggregateId_version_key" RENAME TO "quiz_image_event_store_aggregateId_version_key";
