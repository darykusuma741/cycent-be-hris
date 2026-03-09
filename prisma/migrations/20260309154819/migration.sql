/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `OfficeLocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OfficeLocation_name_key" ON "OfficeLocation"("name");
