-- CreateTable
CREATE TABLE "PlayerMatch" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "matchTime" TIMESTAMP(3) NOT NULL,
    "timestamp" TEXT NOT NULL,
    "isSubstitute" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchScraperRun" (
    "id" TEXT NOT NULL,
    "ranAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchesFound" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,

    CONSTRAINT "MatchScraperRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerMatch_player_idx" ON "PlayerMatch"("player");

-- CreateIndex
CREATE INDEX "PlayerMatch_matchTime_idx" ON "PlayerMatch"("matchTime");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerMatch_matchId_player_key" ON "PlayerMatch"("matchId", "player");
