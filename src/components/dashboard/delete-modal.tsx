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
import { deleteListing } from "@/app/actions/listings"

interface DeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: string
  listingTitle: string
}

export function DeleteModal({
  open,
  onOpenChange,
  listingId,
  listingTitle,
}: DeleteModalProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteListing(listingId)
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete listing?</DialogTitle>
          <DialogDescription>
            &ldquo;{listingTitle}&rdquo; will be permanently deleted. This
            cannot be undone.
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
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
