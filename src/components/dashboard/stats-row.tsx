import { Card, CardContent } from "@/components/ui/card"

interface StatsRowProps {
  activeCount: number
  soldCount: number
  totalCount: number
  avgRating: number | null
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}

export function StatsRow({ activeCount, soldCount, totalCount, avgRating }: StatsRowProps) {
  const avgDisplay = avgRating !== null ? avgRating.toFixed(1) : "—"
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <StatCard label="Active Listings" value={activeCount} />
      <StatCard label="Items Sold" value={soldCount} />
      <StatCard label="Total Listings" value={totalCount} />
      <StatCard label="Avg Rating" value={avgDisplay} />
    </div>
  )
}
