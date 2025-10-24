/*
  Warnings:

  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image_event_store` table. If the table is not empty, all the data it contains will be lost.

*/
ALTER TABLE image RENAME TO quiz_image;
ALTER TABLE image_event_store RENAME TO quiz_image_event_store;