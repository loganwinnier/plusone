/*
  Warnings:

  - You are about to drop the column `hostUsername` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `matches` table. All the data in the column will be lost.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `profiles` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `host_email` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `matches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_hostUsername_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_username_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_username_fkey";

-- DropIndex
DROP INDEX "matches_username_key";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "hostUsername",
ADD COLUMN     "host_email" VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "username",
ADD COLUMN     "userEmail" VARCHAR(64) NOT NULL,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("userEmail", "eventId");

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "username",
ADD COLUMN     "email" VARCHAR(64) NOT NULL,
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("email");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "username",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("email");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_host_email_fkey" FOREIGN KEY ("host_email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
