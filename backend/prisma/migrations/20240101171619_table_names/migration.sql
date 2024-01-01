/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_hostUsername_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_username_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_username_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Match";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(64) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(55),
    "first_name" VARCHAR(35) NOT NULL,
    "last_name" VARCHAR(35) NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "phone_number" VARCHAR(10),

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "profiles" (
    "username" VARCHAR(64) NOT NULL,
    "age" INTEGER NOT NULL,
    "bio" VARCHAR(250) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "traits" VARCHAR(64)[],

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "matches" (
    "username" VARCHAR(64) NOT NULL,
    "eventId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(250) NOT NULL,
    "payment" INTEGER,
    "hostUsername" VARCHAR(64) NOT NULL,
    "type" VARCHAR(64)[],

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "matches_username_key" ON "matches"("username");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_hostUsername_fkey" FOREIGN KEY ("hostUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;
