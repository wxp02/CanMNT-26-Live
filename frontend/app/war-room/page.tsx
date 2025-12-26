"use client"

import Link from "next/link"
import { RosterTiers } from "@/components/roster-tiers"
import { Lock, TrendingUp, Waves, TrendingDown } from "lucide-react"

export default function WarRoom() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  The Ledger
                </Link>
                <Link
                  href="/war-room"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">The War Room</h1>
            <p className="text-lg text-muted-foreground max-w-3xl text-balance">
              Data-driven roster predictions: Who's on the plane to Toronto?
            </p>
          </div>

          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Lock className="h-5 w-5 text-lock" />
              <div className="space-y-0.5">
                <div className="text-sm font-medium">The Locks</div>
                <div className="text-xs text-muted-foreground">100% Probability</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <TrendingUp className="h-5 w-5 text-probable" />
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Probables</div>
                <div className="text-xs text-muted-foreground">75-90%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <Waves className="h-5 w-5 text-bubble" />
              <div className="space-y-0.5">
                <div className="text-sm font-medium">The Bubble</div>
                <div className="text-xs text-muted-foreground">40-60%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
              <TrendingDown className="h-5 w-5 text-cold" />
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Cold/Dropped</div>
                <div className="text-xs text-muted-foreground">{"<"}40%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roster Tiers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <RosterTiers />
      </section>
    </div>
  )
}
