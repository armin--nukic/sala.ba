CREATE TYPE "Role" AS ENUM ('USER', 'OWNER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE "VenueCategory" AS ENUM ('Wedding', 'Sport', 'Celebration', 'Diaspora', 'Conference', 'Other');
CREATE TYPE "InquiryType" AS ENUM ('GENERAL', 'WEDDING', 'SPORT', 'DIASPORA', 'CELEBRATION', 'CONFERENCE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "phone" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Venue" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "category" "VenueCategory" NOT NULL,
  "capacity" INTEGER NOT NULL,
  "priceFrom" DECIMAL(10,2) NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactMessage" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "type" "InquiryType" NOT NULL DEFAULT 'GENERAL',
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Inquiry" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "eventDate" TIMESTAMP(3),
  "guests" INTEGER,
  "message" TEXT NOT NULL,
  "venueId" TEXT NOT NULL,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
