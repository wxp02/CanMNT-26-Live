-- CreateTable
CREATE TABLE "PlayerEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "position" TEXT,
    "team" TEXT,
    "eventType" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "minute" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "matchTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperRun" (
    "id" TEXT NOT NULL,
    "ranAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventsFound" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,

    CONSTRAINT "ScraperRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerSeasonStats" (
    "id" TEXT NOT NULL,
    "player" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "hardcodedTeam" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "matches" INTEGER NOT NULL,
    "minutes" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "formRating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerSeasonStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatsScraperRun" (
    "id" TEXT NOT NULL,
    "ranAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playersFound" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,

    CONSTRAINT "StatsScraperRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlayerEvent_player_idx" ON "PlayerEvent"("player");

-- CreateIndex
CREATE INDEX "PlayerEvent_eventType_idx" ON "PlayerEvent"("eventType");

-- CreateIndex
CREATE INDEX "PlayerEvent_matchTime_idx" ON "PlayerEvent"("matchTime");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerEvent_eventId_player_eventType_minute_key" ON "PlayerEvent"("eventId", "player", "eventType", "minute");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerSeasonStats_player_key" ON "PlayerSeasonStats"("player");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_player_idx" ON "PlayerSeasonStats"("player");

-- CreateIndex
CREATE INDEX "PlayerSeasonStats_season_idx" ON "PlayerSeasonStats"("season");
