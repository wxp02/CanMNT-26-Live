"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const WORLD_CUP_DATE = new Date("2026-06-12T15:00:00-04:00") // June 12, 2026, 3:00 PM EST

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = WORLD_CUP_DATE.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mt-12 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Card className="p-6 text-center bg-card border-border">
          <div className="text-4xl md:text-5xl font-bold text-primary tabular-nums">{timeLeft.days}</div>
          <div className="text-sm text-muted-foreground mt-2">Days</div>
        </Card>
        <Card className="p-6 text-center bg-card border-border">
          <div className="text-4xl md:text-5xl font-bold text-primary tabular-nums">{timeLeft.hours}</div>
          <div className="text-sm text-muted-foreground mt-2">Hours</div>
        </Card>
        <Card className="p-6 text-center bg-card border-border">
          <div className="text-4xl md:text-5xl font-bold text-primary tabular-nums">{timeLeft.minutes}</div>
          <div className="text-sm text-muted-foreground mt-2">Minutes</div>
        </Card>
        <Card className="p-6 text-center bg-card border-border">
          <div className="text-4xl md:text-5xl font-bold text-primary tabular-nums">{timeLeft.seconds}</div>
          <div className="text-sm text-muted-foreground mt-2">Seconds</div>
        </Card>
      </div>

      <div className="text-center space-y-1">
        <div className="text-xl font-semibold text-foreground">Canada vs. UEFA Playoff Winner</div>
        <div className="text-sm text-muted-foreground">Group B Opener • BMO Field, Toronto</div>
      </div>
    </div>
  )
}
