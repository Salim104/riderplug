"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Trash2, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatZAR } from "@/lib/currency"
import { DeleteModal } from "./delete-modal"
import { MarkSoldModal } from "./mark-sold-modal"
import { cn } from "@/lib/utils"

interface ListingRowProps {
  listing: {
    id: string
    title: string
    price: number
    photos: string[]
    status: string
    createdAt: Date | string
    category: string
  }
  showMarkSold?: boolean
}

export function ListingRow({ listing, showMarkSold = false }: ListingRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [soldOpen, setSoldOpen] = useState(false)

  const thumbnail = listing.photos[0] ?? null
  const listedAgo = formatDistanceToNow(new Date(listing.createdAt), {
    addSuffix: true,
  })

  return (
    <>
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 border-b last:border-b-0">
        {/* Thumbnail */}
        <div className="size-14 shrink-0 rounded-md overflow-hidden bg-muted">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={listing.title}
              className="size-full object-cover"
            />
          ) : (
            <div className="size-full bg-gray-200 rounded-md" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{listing.title}</p>
          <p className="text-sm font-semibold text-primary mt-0.5">
            {formatZAR(listing.price)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Listed {listedAgo}
          </p>
        </div>

        {/* Status badge — hidden on mobile */}
        <div className="hidden sm:block shrink-0">
          {listing.status === "active" ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Sold
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {showMarkSold && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setSoldOpen(true)}
            >
              <CheckCircle className="size-3.5" />
              <span className="hidden sm:inline">Sold</span>
            </Button>
          )}

          <Link
            href={`/dashboard/edit/${listing.id}`}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
          >
            <Pencil className="size-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </Link>

          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        listingId={listing.id}
        listingTitle={listing.title}
      />
      {showMarkSold && (
        <MarkSoldModal
          open={soldOpen}
          onOpenChange={setSoldOpen}
          listingId={listing.id}
          listingTitle={listing.title}
        />
      )}
    </>
  )
}
