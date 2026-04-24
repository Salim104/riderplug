"use client"

import { useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { markAsSold } from "@/app/actions/listings"

interface MarkSoldModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: string
  listingTitle: string
}

export function MarkSoldModal({
  open,
  onOpenChange,
  listingId,
  listingTitle,
}: MarkSoldModalProps) {
  const [isPending, startTransition] = useTransition()

  function handleMarkSold() {
    startTransition(async () => {
      await markAsSold(listingId)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Mark as sold?</DialogTitle>
          <DialogDescription>
            &ldquo;{listingTitle}&rdquo; will be moved to your Sold tab and
            marked as unavailable.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleMarkSold} disabled={isPending}>
            {isPending ? "Updating…" : "Mark as Sold"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
