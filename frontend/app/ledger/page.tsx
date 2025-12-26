"use client"

import { useState } from "react"
import Link from "next/link"
import { ActivityTable } from "@/components/activity-table"
import { ActivityFilters } from "@/components/activity-filters"

export default function Ledger() {
  const [filters, setFilters] = useState({
    eventType: "all",
    timeRange: "all",
    player: "all",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-foreground">CanMNT 26 LIVE</span>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Command Center
                </Link>
                <Link
                  href="/ledger"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  The Ledger
                </Link>
                <Link
                  href="/war-room"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  War Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">The Activity Ledger</h1>
            <p className="text-lg text-muted-foreground max-w-3xl text-balance">
              A complete, timestamped record of every goal, assist, card, and action from CanMNT players across all
              leagues
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <ActivityFilters filters={filters} setFilters={setFilters} />
        <ActivityTable filters={filters} />
      </section>
    </div>
  )
}
