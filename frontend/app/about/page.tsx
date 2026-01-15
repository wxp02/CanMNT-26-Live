"use client";

import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { Info, Mail, Heart, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  CanMNT 26 LIVE
                </span>
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  War Room
                </Link>
              </div>
            </div>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              About CanMNT 26 LIVE
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your mission control for the road to the 2026 FIFA World Cup
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Mission Statement */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CanMNT 26 LIVE is a real-time tracking and analytics hub for
            Canadian Men's National Team players as we prepare for the historic
            2026 FIFA World Cup on home soil. We provide live updates,
            performance metrics, and data-driven roster insights to help fans
            track every moment of Canada's journey to Toronto.
          </p>
        </div>

        {/* What We Do */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">What We Track</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 bg-card/50 border-border/50">
              <div className="w-12 h-12 rounded-lg bg-goal/10 border border-goal/20 flex items-center justify-center">
                <span className="text-2xl">⚽</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Live Pulse
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time goals, assists, cards, and match events from Canadian
                players worldwide
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/50 border-border/50">
              <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                The Ledger
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete activity log with filtering by player, event type, and
                time range
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-card/50 border-border/50">
              <div className="w-12 h-12 rounded-lg bg-assist/10 border border-assist/20 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                War Room
              </h3>
              <p className="text-sm text-muted-foreground">
                Data-driven roster predictions and probability analysis for the
                final 26-man squad
              </p>
            </Card>
          </div>
        </div>

        {/* Data Sources */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Data Sources</h2>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Our platform aggregates real-time data from SofaScore, one of the
              world's leading sports data providers. We track 27 key Canadian
              national team players across top leagues worldwide, including:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-medium text-foreground">European Leagues:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Bundesliga (Germany)</li>
                  <li>Serie A (Italy)</li>
                  <li>La Liga (Spain)</li>
                  <li>Primeira Liga (Portugal)</li>
                  <li>Scottish Premiership</li>
                  <li>Belgian Pro League</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  North American Leagues:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>MLS (United States/Canada)</li>
                  <li>Liga MX (Mexico)</li>
                  <li>CPL (Canadian Premier League)</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Data is updated multiple times daily to ensure accuracy and
              timeliness.
            </p>
          </div>
        </div>

        {/* Why We Built This */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              Why We Built This
            </h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The 2026 FIFA World Cup will be a defining moment for Canadian
            soccer. As co-hosts alongside the United States and Mexico, Canada
            will open the tournament at BMO Field in Toronto. This is more than
            a competition—it's a once-in-a-generation opportunity to showcase
            our nation on the world stage.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            CanMNT 26 LIVE was created by passionate Canadian soccer fans who
            wanted a centralized hub to follow our players' performances across
            the globe. From Bayern Munich to Nashville SC, from Juventus to FC
            Porto, our players are scattered worldwide, and we wanted to bring
            them all together in one place.
          </p>
        </div>

        {/* The Countdown */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">June 12, 2026</h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">
              Canada vs. UEFA Playoff Winner
            </span>
            <br />
            Group B Opener • BMO Field, Toronto
            <br />
            <span className="text-sm">The journey begins on home soil.</span>
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Get in Touch</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Have questions, feedback, or suggestions? We'd love to hear from
            you. Whether you're a casual fan or a data analyst, your input helps
            us improve CanMNT 26 LIVE for the entire community.
          </p>
          <Card className="p-6 bg-muted/30 border-border/50 space-y-4">
            <div className="space-y-2">
              <p className="text-foreground">
                <span className="font-medium">Contact:</span>{" "}
                <a
                  href="mailto:maplestampsteam@gmail.com"
                  className="text-primary hover:underline"
                >
                  maplestampsteam@gmail.com
                </a>
              </p>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border/50 pt-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Disclaimer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            CanMNT 26 LIVE is an independent fan project and is not affiliated
            with, endorsed by, or connected to Canada Soccer, FIFA, or any
            professional soccer league or club. All team names, logos, and
            trademarks are the property of their respective owners. Player
            statistics and match data are provided for informational and
            entertainment purposes only.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Roster predictions and probability calculations are based on data
            analysis and should not be considered official predictions or
            insider information. Final roster decisions are made by Canada
            Soccer's coaching staff.
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center py-8">
          <p className="text-lg text-foreground font-medium">
            🍁 Let's bring the World Cup home 🍁
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            #CANMNT #WorldCup2026
          </p>
        </div>
      </section>
    </div>
  );
}
