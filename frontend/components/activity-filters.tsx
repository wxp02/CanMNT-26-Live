"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityFiltersProps {
  filters: {
    eventType: string
    timeRange: string
    player: string
  }
  setFilters: (filters: any) => void
}

export function ActivityFilters({ filters, setFilters }: ActivityFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 p-4 rounded-lg bg-card border border-border">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Filter by:</span>
      </div>

      <Select value={filters.eventType} onValueChange={(value) => setFilters({ ...filters, eventType: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="goal">Goals Only</SelectItem>
          <SelectItem value="assist">Assists Only</SelectItem>
          <SelectItem value="card">Cards Only</SelectItem>
          <SelectItem value="cleansheet">Clean Sheets</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.timeRange} onValueChange={(value) => setFilters({ ...filters, timeRange: value })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Time Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="7days">Last 7 Days</SelectItem>
          <SelectItem value="30days">Last 30 Days</SelectItem>
          <SelectItem value="season">This Season</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.player} onValueChange={(value) => setFilters({ ...filters, player: value })}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Player" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Players</SelectItem>
          <SelectItem value="davies">Alphonso Davies</SelectItem>
          <SelectItem value="david">Jonathan David</SelectItem>
          <SelectItem value="buchanan">Tajon Buchanan</SelectItem>
          <SelectItem value="eustaquio">Stephen Eustáquio</SelectItem>
          <SelectItem value="larin">Cyle Larin</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setFilters({ eventType: "all", timeRange: "all", player: "all" })}
      >
        Reset Filters
      </Button>
    </div>
  )
}
