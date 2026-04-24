"use client"

import { PackageOpen } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ListingRow } from "./listing-row"

interface Listing {
  id: string
  title: string
  price: number
  photos: string[]
  status: string
  createdAt: Date | string
  category: string
}

interface ListingsTabsProps {
  listings: Listing[]
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
      <PackageOpen className="size-10 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export function ListingsTabs({ listings }: ListingsTabsProps) {
  const active = listings.filter((l) => l.status === "active")
  const sold = listings.filter((l) => l.status === "sold")

  return (
    <Tabs defaultValue="active" className="w-full">
      <div className="border-b px-4">
        <TabsList
          variant="line"
          className="h-10 w-fit rounded-none bg-transparent gap-0 p-0"
        >
          <TabsTrigger
            value="active"
            className="rounded-none px-4 h-10 data-active:text-primary after:bg-primary"
          >
            Active Listings
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-normal tabular-nums">
              {active.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="sold"
            className="rounded-none px-4 h-10 data-active:text-primary after:bg-primary"
          >
            Sold
            <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-normal tabular-nums">
              {sold.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="active">
        {active.length === 0 ? (
          <EmptyState message="No active listings yet. Create your first listing." />
        ) : (
          <div>
            {active.map((listing) => (
              <ListingRow key={listing.id} listing={listing} showMarkSold />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="sold">
        {sold.length === 0 ? (
          <EmptyState message="No sold listings yet." />
        ) : (
          <div>
            {sold.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
