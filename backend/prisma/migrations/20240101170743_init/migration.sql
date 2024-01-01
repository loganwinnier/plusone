-- CreateTable
CREATE TABLE "User" (
    "username" VARCHAR(64) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(55),
    "first_name" VARCHAR(35) NOT NULL,
    "last_name" VARCHAR(35) NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,
    "phone_number" VARCHAR(10),

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Profile" (
    "username" VARCHAR(64) NOT NULL,
    "age" INTEGER NOT NULL,
    "bio" VARCHAR(250) NOT NULL,
    "gender" VARCHAR(20) NOT NULL,
    "traits" VARCHAR(64)[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Match" (
    "username" VARCHAR(64) NOT NULL,
    "eventId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(250) NOT NULL,
    "payment" INTEGER,
    "hostUsername" VARCHAR(64) NOT NULL,
    "type" VARCHAR(64)[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Match_username_key" ON "Match"("username");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostUsername_fkey" FOREIGN KEY ("hostUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
