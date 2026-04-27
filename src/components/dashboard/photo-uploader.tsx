"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, X } from "lucide-react"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const MAX_PHOTOS = 5

interface PhotoUploaderProps {
  initialPhotos?: string[]
  onChange: (urls: string[]) => void
}

export function PhotoUploader({ initialPhotos, onChange }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos ?? [])

  function handleRemove(url: string) {
    const next = photos.filter((u) => u !== url)
    setPhotos(next)
    onChange(next)
  }

  function handleAdd(url: string) {
    const next = [...photos, url]
    setPhotos(next)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {photos.map((url) => (
            <div key={url} className="relative size-24 overflow-hidden rounded-lg border border-border">
              <Image src={url} alt="Listing photo" fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                aria-label="Remove photo"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {photos.length}/{MAX_PHOTOS} photos added
        </p>
      )}

      {photos.length < MAX_PHOTOS && (
        <CldUploadWidget
          uploadPreset="riderplug_listings"
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          }}
          onSuccess={(result) => {
            if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
              handleAdd(result.info.secure_url as string)
            }
          }}
        >
          {({ open }) =>
            photos.length === 0 ? (
              <div
                className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:border-ring hover:bg-muted/50"
                onClick={() => open()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && open()}
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <ImagePlus className="size-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Drag &amp; drop images here</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">JPG, PNG or WebP — up to 5 photos</p>
                </div>
                <span className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  Browse Files
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => open()}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <ImagePlus className="size-4" />
                Add photo
              </button>
            )
          }
        </CldUploadWidget>
      )}
    </div>
  )
}
