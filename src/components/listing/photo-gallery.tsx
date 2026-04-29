"use client"

import { useState } from "react"

interface PhotoGalleryProps {
  photos: string[]
  title: string
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [active, setActive] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
        No photos
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Main photo */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[active]}
          alt={title}
          className="size-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === active ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i + 1}`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
