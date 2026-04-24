import Link from "next/link"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { StatsRow } from "@/components/dashboard/stats-row"
import { ListingsTabs } from "@/components/dashboard/listings-tabs"
import { getSellerListings, getSellerStats } from "@/app/actions/listings"
import { MOCK_SELLER_ID } from "@/lib/mock-user"

export default async function DashboardPage() {
  const [listings, stats] = await Promise.all([
    getSellerListings(MOCK_SELLER_ID),
    getSellerStats(MOCK_SELLER_ID),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your listings and track performance.
          </p>
        </div>
        <Link
          href="/sell"
          className={buttonVariants({ size: "sm", className: "shrink-0 gap-1.5" })}
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Listing</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      <div className="mt-6">
        <StatsRow {...stats} />
      </div>

      <div className="mt-6 rounded-xl bg-white ring-1 ring-black/5">
        <ListingsTabs listings={listings} />
      </div>
    </div>
  )
}
