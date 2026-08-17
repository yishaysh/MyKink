-- ========================================================
-- NEON POSTGRESQL FULL SCHEMA SCRIPT FOR MYKINK
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Couple Table
CREATE TABLE IF NOT EXISTS "Couple" (
    "id" TEXT NOT NULL,
    "pairCode" TEXT NOT NULL,
    "coupleSalt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Couple_pkey" PRIMARY KEY ("id")
);

-- 2. User Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "anonymousAlias" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "deviceIdentity" TEXT NOT NULL,
    "coupleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- 3. QuestionCatalog Table
CREATE TABLE IF NOT EXISTS "QuestionCatalog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "intensityLevel" TEXT NOT NULL,
    "roleType" TEXT NOT NULL DEFAULT 'SYMMETRIC',
    "linkedQuestionId" TEXT,

    CONSTRAINT "QuestionCatalog_pkey" PRIMARY KEY ("id")
);

-- 4. UserAnswer Table
CREATE TABLE IF NOT EXISTS "UserAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "encryptedValue" TEXT NOT NULL,
    "answerHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- 5. SharedMatch Table
CREATE TABLE IF NOT EXISTS "SharedMatch" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "matchStatus" TEXT NOT NULL,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedMatch_pkey" PRIMARY KEY ("id")
);

-- 6. CoupleChallenge Table
CREATE TABLE IF NOT EXISTS "CoupleChallenge" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "matchId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "pointsValue" INTEGER NOT NULL DEFAULT 10,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoupleChallenge_pkey" PRIMARY KEY ("id")
);

-- 7. IntimacyLog Table
CREATE TABLE IF NOT EXISTS "IntimacyLog" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "durationMinutes" INTEGER,
    "location" TEXT,
    "protectionUsed" BOOLEAN NOT NULL DEFAULT true,
    "moodRating" INTEGER NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntimacyLog_pkey" PRIMARY KEY ("id")
);

-- 8. Dare Table
CREATE TABLE IF NOT EXISTS "Dare" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pointsValue" INTEGER NOT NULL DEFAULT 10,
    "difficulty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dare_pkey" PRIMARY KEY ("id")
);

-- 9. EphemeralMessage Table
CREATE TABLE IF NOT EXISTS "EphemeralMessage" (
    "id" TEXT NOT NULL,
    "coupleId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EphemeralMessage_pkey" PRIMARY KEY ("id")
);

-- Indexes and Unique Constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Couple_pairCode_key" ON "Couple"("pairCode");
CREATE UNIQUE INDEX IF NOT EXISTS "User_deviceIdentity_key" ON "User"("deviceIdentity");
CREATE UNIQUE INDEX IF NOT EXISTS "UserAnswer_userId_questionId_key" ON "UserAnswer"("userId", "questionId");
CREATE UNIQUE INDEX IF NOT EXISTS "SharedMatch_coupleId_questionId_key" ON "SharedMatch"("coupleId", "questionId");

-- Foreign Keys
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'User_coupleId_fkey') THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'QuestionCatalog_linkedQuestionId_fkey') THEN
        ALTER TABLE "QuestionCatalog" ADD CONSTRAINT "QuestionCatalog_linkedQuestionId_fkey" FOREIGN KEY ("linkedQuestionId") REFERENCES "QuestionCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'UserAnswer_userId_fkey') THEN
        ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'UserAnswer_questionId_fkey') THEN
        ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'SharedMatch_coupleId_fkey') THEN
        ALTER TABLE "SharedMatch" ADD CONSTRAINT "SharedMatch_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'CoupleChallenge_coupleId_fkey') THEN
        ALTER TABLE "CoupleChallenge" ADD CONSTRAINT "CoupleChallenge_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'IntimacyLog_coupleId_fkey') THEN
        ALTER TABLE "IntimacyLog" ADD CONSTRAINT "IntimacyLog_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Dare_creatorId_fkey') THEN
        ALTER TABLE "Dare" ADD CONSTRAINT "Dare_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'EphemeralMessage_coupleId_fkey') THEN
        ALTER TABLE "EphemeralMessage" ADD CONSTRAINT "EphemeralMessage_coupleId_fkey" FOREIGN KEY ("coupleId") REFERENCES "Couple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
