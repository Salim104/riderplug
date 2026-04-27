"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AvatarUploaderProps {
  value: string | undefined
  displayName: string
  onChange: (url: string) => void
}

export function AvatarUploader({ value, displayName, onChange }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(value)
  const initial = displayName.trim()[0]?.toUpperCase() ?? "?"

  function handleSuccess(url: string) {
    setPreview(url)
    onChange(url)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-20 overflow-hidden rounded-full bg-muted">
        {preview ? (
          <Image src={preview} alt="Avatar" fill className="object-cover" sizes="80px" />
        ) : (
          <span className="flex size-full items-center justify-center text-2xl font-semibold text-muted-foreground">
            {initial}
          </span>
        )}
      </div>

      <CldUploadWidget
        uploadPreset="riderplug_listings"
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          cropping: true,
          croppingAspectRatio: 1,
        }}
        onSuccess={(result) => {
          if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
            handleSuccess(result.info.secure_url as string)
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Change Photo
          </button>
        )}
      </CldUploadWidget>
    </div>
  )
}
