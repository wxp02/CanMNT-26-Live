"use client"
import { CountdownTimer } from "@/components/countdown-timer"
import { LivePulse } from "@/components/live-pulse"
import Link from "next/link"

export default function CommandCenter() {
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
                <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  War Room
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-[url('/abstract-canadian-soccer-field-aerial.jpg')] bg-cover bg-center opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">2026 FIFA World Cup</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-balance">
              The Countdown is On
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Track every moment until Canada takes the field at BMO Field
            </p>
          </div>

          <CountdownTimer />
        </div>
      </section>

      {/* Live Pulse Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Live Pulse</h2>
              <p className="text-muted-foreground">Real-time updates from CanMNT players worldwide</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-goal animate-pulse" />
              <span className="text-sm font-medium text-muted-foreground">Live</span>
            </div>
          </div>

          <LivePulse />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-2">
            <div className="text-3xl font-bold text-goal">47</div>
            <div className="text-sm text-muted-foreground">Goals This Season</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 space-y-2">
            <div className="text-3xl font-bold text-assist">32</div>
            <div className="text-sm text-muted-foreground">Assists This Season</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 space-y-2">
            <div className="text-3xl font-bold text-primary">23</div>
            <div className="text-sm text-muted-foreground">Active Roster Candidates</div>
          </div>
        </div>
      </section>
    </div>
  )
}
